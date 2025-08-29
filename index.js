const express = require('express')
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode')
const path = require('path')
const WebSocket = require('ws')

const app = express()
app.use(express.json())

let sock
let isConnected = false
let currentQR = null

// Serve static frontend files
app.use('/app', express.static(path.join(__dirname, 'public')))

// Tambahkan endpoint status
app.get('/status', (req, res) => {
  res.json({ connected: isConnected })
})

// Endpoint utama — cek koneksi Baileys
app.get('/', (req, res) => {
  if (isConnected) {
    res.sendFile(path.join(__dirname, 'public/index.html'))
  } else {
    res.sendFile(path.join(__dirname, 'public/qr.html'))
  }
})

// Endpoint untuk ambil QR dari frontend, sekaligus status koneksi
app.get('/qr', (req, res) => {
  if (isConnected) {
    res.json({ connected: true }) // Kirim sinyal sudah connect
  } else if (currentQR) {
    res.json({ qr: currentQR })
  } else {
    res.json({ message: 'QR Code belum tersedia atau sudah kadaluarsa' })
  }
})

async function startSocket() {
  const { state, saveCreds } = await useMultiFileAuthState('session')
  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  })

  sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    if (connection === 'open') {
      console.log('✅ WhatsApp connected successfully!')
      isConnected = true
      currentQR = null
    } else if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode
      console.log(`❌ Disconnected from WhatsApp. Reason code: ${reason}`)
      isConnected = false

      if (reason === 401) {
        console.log('🔒 Session expired, please delete session folder and rescan QR')
      } else {
        console.log('🔄 Attempting to reconnect in 5 seconds...')
        await new Promise(resolve => setTimeout(resolve, 5000))
        startSocket()
      }
    }

    if (qr) {
      currentQR = qr
      console.log('📲 QR Code received, ready to serve to client')
    }
  })

  sock.ev.on('creds.update', saveCreds)
}
startSocket().catch(err => {
  console.error('❌ Error starting WhatsApp socket:', err)
    
    process.exit(1)
})

// WebSocket server opsional (kalau mau kirim realtime QR via WS)
const server = app.listen(process.env.PORT || 3001, () => {
  console.log('Server running on http://localhost:3001')
})

const wss = new WebSocket.Server({ server })

function broadcastQr(qrDataUrl) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ qr: qrDataUrl }))
    }
  })
}

// Endpoint validasi nomor WhatsApp
app.post('/validate-bulk', async (req, res) => {
  if (!isConnected) {
    return res.status(503).json({ error: 'WhatsApp belum terhubung, scan QR dulu.' })
  }

  const { numbers } = req.body
  if (!numbers || !Array.isArray(numbers)) {
    return res.status(400).json({ error: 'Masukkan array nomor dengan key "numbers"' })
  }

  const results = []
  for (const nomor of numbers) {
    try {
      const cleanNumber = nomor.replace(/^\+/, '').trim()
      const cek = await sock.onWhatsApp(cleanNumber)
      results.push({ nomor, exists: cek[0]?.exists || false })
    } catch (err) {
      results.push({ nomor, exists: false, error: err.message })
    }
  }

  res.json(results)
})

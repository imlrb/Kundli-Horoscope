const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const app = express()
app.use(cors())
app.use(bodyParser.json())

function sunSignFromDate(date) {
  const d = new Date(date)
  const day = d.getUTCDate()
  const month = d.getUTCMonth() + 1
  const zodiac = [
    { name: 'Capricorn', start: [12,22], end: [1,19] },
    { name: 'Aquarius', start: [1,20], end: [2,18] },
    { name: 'Pisces', start: [2,19], end: [3,20] },
    { name: 'Aries', start: [3,21], end: [4,19] },
    { name: 'Taurus', start: [4,20], end: [5,20] },
    { name: 'Gemini', start: [5,21], end: [6,20] },
    { name: 'Cancer', start: [6,21], end: [7,22] },
    { name: 'Leo', start: [7,23], end: [8,22] },
    { name: 'Virgo', start: [8,23], end: [9,22] },
    { name: 'Libra', start: [9,23], end: [10,22] },
    { name: 'Scorpio', start: [10,23], end: [11,21] },
    { name: 'Sagittarius', start: [11,22], end: [12,21] }
  ]
  for (let z of zodiac) {
    const [sM, sD] = z.start
    const [eM, eD] = z.end
    if ((month === sM && day >= sD) || (month === eM && day <= eD) ||
        (sM < eM && month > sM && month < eM) ||
        (sM > eM && (month > sM || month < eM))) {
      return z.name
    }
  }
  return 'Unknown'
}

async function calculateKundali({ name, dob, time, place }) {
  const datetime = new Date(`${dob}T${time}:00Z`)
  const sunSign = sunSignFromDate(datetime)
  const planets = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu']
  const chart = {}
  planets.forEach((p, i) => {
    chart[p] = {
      longitude: ((i * 40) + (datetime.getUTCMinutes() % 30)),
      house: ((i % 12) + 1)
    }
  })
  const horoscope = `You are a ${sunSign}. This is a basic horoscope. For accurate results, integrate Swiss Ephemeris or an astrology API.`
  return { name, datetime: datetime.toISOString(), place, chart, horoscope }
}

app.post('/api/generate', async (req, res) => {
  try {
    const { name, dob, time, place } = req.body
    if (!name || !dob || !time || !place) return res.status(400).json({ error: 'Missing fields' })
    const out = await calculateKundali({ name, dob, time, place })
    res.json(out)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Server running on port', port))

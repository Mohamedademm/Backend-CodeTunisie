const express = require('express');
const router = express.Router();
const axios = require('axios');

// Route: POST /api/tts/speak
// Desc: Generate speech using ElevenLabs API (or compatible)
// Access: Private (should be, but public for now for testing)
router.post('/speak', async (req, res) => {
    try {
        const { text, voiceId } = req.body;

        if (!text) {
            return res.status(400).json({ message: 'Text is required' });
        }

        // Default Voice ID: 'Rachel' (or a specific Arabic one if we find it)
        // ElevenLabs Multilingual v2 model supports Arabic/Tunisian nuances well
        const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
        const VOICE_ID = voiceId || '21m00Tcm4TlvDq8ikWAM'; // Default Rachel, user can change to an Arabic voice ID

        if (!ELEVEN_LABS_API_KEY) {
            console.warn("TTS: No API Key found for ElevenLabs");
            return res.status(503).json({ message: "TTS Service unavailable (Missing API Key)" });
        }

        const response = await axios({
            method: 'post',
            url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
            headers: {
                'Accept': 'audio/mpeg',
                'xi-api-key': ELEVEN_LABS_API_KEY,
                'Content-Type': 'application/json',
            },
            data: {
                text: text,
                model_id: "eleven_multilingual_v2", // Crucial for Arabic support
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5
                }
            },
            responseType: 'stream'
        });

        res.set('Content-Type', 'audio/mpeg');
        response.data.pipe(res);

    } catch (error) {
        console.error('TTS API Error:', error?.response?.data || error.message);
        res.status(500).json({ message: 'Error generating speech' });
    }
});

module.exports = router;

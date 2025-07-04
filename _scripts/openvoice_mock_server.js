/**
 * 🎤 OpenVoice Mock Server
 * Simula API do OpenVoice para testes sem Docker
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'OpenVoice Mock',
    version: '1.0.0',
    timestamp: Date.now()
  });
});

// Get available voices
app.get('/voices', (req, res) => {
  res.json({
    voices: [
      {
        id: 'default',
        name: 'Female Portuguese',
        language: 'Portuguese',
        gender: 'female'
      },
      {
        id: 'male',
        name: 'Male Portuguese',
        language: 'Portuguese',
        gender: 'male'
      }
    ]
  });
});

// Synthesize text to speech
app.post('/synthesize', (req, res) => {
  const { text, speaker_id = 'default', language = 'Portuguese', speed = 1.0 } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  
  console.log(`🎤 Synthesizing: "${text.substring(0, 50)}..." (speaker: ${speaker_id}, lang: ${language})`);
  
  // Simulate processing time
  setTimeout(() => {
    // Generate simple WAV audio
    const audioBuffer = generateSimpleWAV(text, speed);
    
    res.set({
      'Content-Type': 'audio/wav',
      'Content-Length': audioBuffer.length
    });
    
    res.send(audioBuffer);
  }, 500 + text.length * 10); // 500ms + 10ms per character
});

function generateSimpleWAV(text, speed = 1.0) {
  // WAV file parameters
  const sampleRate = 44100;
  const duration = Math.max(1.0, text.length * 0.08 / speed); // 80ms per character
  const numSamples = Math.floor(sampleRate * duration);
  const numChannels = 1;
  const bytesPerSample = 2;
  const byteRate = sampleRate * numChannels * bytesPerSample;
  const dataSize = numSamples * numChannels * bytesPerSample;
  const fileSize = 44 + dataSize;
  
  // Create buffer
  const buffer = Buffer.alloc(fileSize);
  let offset = 0;
  
  // WAV Header
  buffer.write('RIFF', offset); offset += 4;
  buffer.writeUInt32LE(fileSize - 8, offset); offset += 4;
  buffer.write('WAVE', offset); offset += 4;
  buffer.write('fmt ', offset); offset += 4;
  buffer.writeUInt32LE(16, offset); offset += 4;
  buffer.writeUInt16LE(1, offset); offset += 2;
  buffer.writeUInt16LE(numChannels, offset); offset += 2;
  buffer.writeUInt32LE(sampleRate, offset); offset += 4;
  buffer.writeUInt32LE(byteRate, offset); offset += 4;
  buffer.writeUInt16LE(numChannels * bytesPerSample, offset); offset += 2;
  buffer.writeUInt16LE(bytesPerSample * 8, offset); offset += 2;
  buffer.write('data', offset); offset += 4;
  buffer.writeUInt32LE(dataSize, offset); offset += 4;
  
  // Generate tone based on text
  const frequency = 440 + (hashCode(text) % 200); // Frequency based on text
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    
    // Main tone
    let sample = 0.3 * Math.sin(2 * Math.PI * frequency * t);
    
    // Add harmonics for more natural sound
    sample += 0.1 * Math.sin(2 * Math.PI * frequency * 2 * t);
    sample += 0.05 * Math.sin(2 * Math.PI * frequency * 3 * t);
    
    // Envelope for smooth start/end
    let envelope = 1.0;
    if (i < sampleRate * 0.1) { // Fade in
      envelope = i / (sampleRate * 0.1);
    } else if (i > numSamples - sampleRate * 0.1) { // Fade out
      envelope = (numSamples - i) / (sampleRate * 0.1);
    }
    
    sample *= envelope;
    
    // Convert to 16-bit signed integer
    const value = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(value, offset);
    offset += 2;
  }
  
  return buffer;
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

app.listen(PORT, () => {
  console.log(`🎤 OpenVoice Mock Server started on port ${PORT}`);
  console.log(`🔗 Endpoints available:`);
  console.log(`  - GET  http://localhost:${PORT}/health`);
  console.log(`  - GET  http://localhost:${PORT}/voices`);
  console.log(`  - POST http://localhost:${PORT}/synthesize`);
  console.log(`🧪 Test with: curl http://localhost:${PORT}/health`);
});

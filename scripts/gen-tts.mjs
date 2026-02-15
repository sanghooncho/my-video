#!/usr/bin/env node
/**
 * Generate MP3 voiceover files using Google Cloud Text-to-Speech.
 *
 * Usage:
 *   node scripts/gen-tts.mjs --in tts/b2b_18.ko.json
 *   node scripts/gen-tts.mjs --in tts/b2b_18.en.json
 *
 * JSON format:
 * {
 *   "lang": "ko-KR" | "en-US",
 *   "gender": "female" | "male",  // optional (default female)
 *   "voice": "ko-KR-Wavenet-A",    // optional (overrides gender default)
 *   "speakingRate": 1.02,           // optional
 *   "pitch": 0,                     // optional
 *   "outDir": "public/generated-tts",
 *   "prefix": "b2b_18",
 *   "lines": [
 *     {"id": "tts1", "text": "..."},
 *     {"id": "tts2", "text": "..."}
 *   ]
 * }
 */

import fs from 'node:fs';
import path from 'node:path';

import * as dotenv from 'dotenv';
import textToSpeech from '@google-cloud/text-to-speech';

const repoDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const configEnv = path.join(repoDir, 'config', '.env');
if (fs.existsSync(configEnv)) {
  dotenv.config({ path: configEnv });
}

function arg(name) {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return null;
  return process.argv[idx + 1] ?? null;
}

const inPath = arg('--in');
if (!inPath) {
  console.error('Missing --in <json>');
  process.exit(2);
}

const absIn = path.isAbsolute(inPath) ? inPath : path.join(repoDir, inPath);
const spec = JSON.parse(fs.readFileSync(absIn, 'utf-8'));

const lang = spec.lang;
if (!lang) throw new Error('spec.lang is required');

const outDir = spec.outDir ?? 'public/generated-tts';
const absOutDir = path.isAbsolute(outDir) ? outDir : path.join(repoDir, outDir);
fs.mkdirSync(absOutDir, { recursive: true });

const prefix = spec.prefix ?? 'tts';
const gender = (spec.gender ?? 'female').toLowerCase();

function defaultVoice() {
  if (spec.voice) return spec.voice;
  if (lang === 'ko-KR') {
    return gender === 'male' ? 'ko-KR-Wavenet-C' : 'ko-KR-Wavenet-A';
  }
  if (lang === 'en-US') {
    return gender === 'male' ? 'en-US-Wavenet-D' : 'en-US-Wavenet-F';
  }
  // fallback
  return undefined;
}

const voiceName = defaultVoice();
const speakingRate = spec.speakingRate ?? 1.0;
const pitch = spec.pitch ?? 0;

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('GOOGLE_APPLICATION_CREDENTIALS is not set. Put it in config/.env or env.');
  process.exit(2);
}

const client = new textToSpeech.TextToSpeechClient();

for (const line of spec.lines ?? []) {
  const id = line.id;
  const text = line.text;
  if (!id || !text) continue;

  const outFile = `${prefix}_${id}_${lang}.mp3`;
  const outPath = path.join(absOutDir, outFile);

  console.log(`🎙️ TTS ${id} → ${outFile}`);

  const request = {
    input: { text },
    voice: {
      languageCode: lang,
      name: voiceName,
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate,
      pitch,
    },
  };

  const [response] = await client.synthesizeSpeech(request);
  if (!response.audioContent) {
    throw new Error(`No audioContent for ${id}`);
  }

  fs.writeFileSync(outPath, response.audioContent, 'binary');
}

console.log('✅ done');

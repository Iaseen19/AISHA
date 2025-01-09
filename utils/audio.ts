export async function convertWebmToWav(webmBlob: Blob): Promise<Float32Array> {
  // Create an audio context
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Convert blob to array buffer
  const arrayBuffer = await webmBlob.arrayBuffer();
  
  // Decode the audio data
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  // Get the audio data as Float32Array
  const audioData = audioBuffer.getChannelData(0);
  
  // Close the audio context
  await audioContext.close();
  
  return audioData;
}

export async function resampleAudio(audioData: Float32Array, originalSampleRate: number, targetSampleRate: number): Promise<Float32Array> {
  const ratio = targetSampleRate / originalSampleRate;
  const newLength = Math.round(audioData.length * ratio);
  const result = new Float32Array(newLength);
  
  for (let i = 0; i < newLength; i++) {
    const position = i / ratio;
    const index = Math.floor(position);
    const decimal = position - index;
    
    if (index >= audioData.length - 1) {
      result[i] = audioData[audioData.length - 1];
    } else {
      result[i] = audioData[index] * (1 - decimal) + audioData[index + 1] * decimal;
    }
  }
  
  return result;
} 
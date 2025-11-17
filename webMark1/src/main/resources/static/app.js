<!-- AudioContext: 브라우저에서 소리를 재생하기 위한 엔진-->
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();


// 건반별 주파수 (피아노 음계)
const keyToFreq = {
    'A': 261.63,  // C4
    'S': 293.66,  // D4
    'D': 329.63,  // E4
    'F': 349.23,  // F4
    'G': 392.00,  // G4
    'H': 440.00,  // A4
    'J': 493.88,  // B4
    'K': 523.25,  // C5
    'L': 587.33   // D5
};

// 키보드 눌렀을 때 이벤트 감지
document.addEventListener("keydown", (e) => {
    const key = e.key.toUpperCase();

    if (!keyToFreq[key]) return;

    // 실제 건반처럼 눌러지는 효과
    const keyElement = document.querySelector(`.key[data-key="${key}"]`);
    keyElement.classList.add("active");

    // Web Audio로 음 생성, 소리 만드는 부분
    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = keyToFreq[key];

    // 부드럽게 소리나게 하는 효과, 갑자기 끊어지는 소리나면 이상해서
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.5, audioCtx.currentTime + 0.01);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // 소리 재생 및 정지
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3); // 짧게 끊어주는 피아노 느낌
});

// 키를 놓았을 때 active 효과 제거
document.addEventListener("keyup", (e) => {
    const key = e.key.toUpperCase();
    const keyElement = document.querySelector(`.key[data-key="${key}"]`);
    if (keyElement) keyElement.classList.remove("active");
});
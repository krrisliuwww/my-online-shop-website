// Variabel Global
let randomNumber;
let guessesLeft;
const MAX_GUESSES = 7; 
let previousGuesses = [];

// Ambil elemen dari DOM
const guessInput = document.getElementById('guessInput');
const submitGuess = document.getElementById('submitGuess');
const resultDisplay = document.getElementById('result');
const guessesLeftDisplay = document.getElementById('guessesLeft');
const prevGuessesDisplay = document.getElementById('prevGuesses');
const resetGameButton = document.getElementById('resetGame');

// --- Fungsi Utama ---

function initGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    guessesLeft = MAX_GUESSES;
    previousGuesses = [];

    // Reset Tampilan
    guessesLeftDisplay.textContent = guessesLeft;
    prevGuessesDisplay.textContent = 'Belum ada';
    resultDisplay.textContent = '🌸 Angka apa yang tersembunyi?';
    resultDisplay.className = 'message initial'; 
    guessInput.value = '';
    
    guessInput.disabled = false;
    submitGuess.disabled = false;
    resetGameButton.classList.add('hidden');
    
    console.log('Angka Rahasia (untuk debugging): ' + randomNumber); 
}

function checkGuess() {
    // Pastikan input dibaca sebagai integer dan input dibersihkan dari spasi/karakter non-angka
    const userGuess = parseInt(guessInput.value.trim());

    // 1. VALIDASI INPUT (HARUS DIJALANKAN DULU)
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        Swal.fire({
            icon: 'error',
            title: 'Oopsie!',
            text: 'Itu bukan angka 1-100, Coba lagi yang benar!',
            confirmButtonColor: '#FF5A73'
        });
        resultDisplay.textContent = 'Bukan angka valid. Angka 1-100 saja, ya.';
        resultDisplay.className = 'message feedback-low'; // Gunakan feedback low untuk error
        guessInput.value = '';
        guessInput.focus();
        return; // Hentikan fungsi jika input tidak valid
    }

    // 2. CEK TEBAKAN GANDA (SEBELUM MENGURANGI KESEMPATAN)
    if (previousGuesses.includes(userGuess)) {
        Swal.fire({
            icon: 'info',
            title: 'Sudah Pernah!',
            text: `Angka ${userGuess} sudah pernah kamu tebak. Anggap saja itu *vintage*, tapi kita butuh yang baru!`,
            confirmButtonColor: '#FF5A73'
        });
        resultDisplay.textContent = `Tebakan ${userGuess} sudah ada di riwayat.`;
        resultDisplay.className = 'message feedback-high'; // Gunakan feedback high untuk info
        guessInput.value = '';
        guessInput.focus();
        return; // Hentikan fungsi jika tebakan ganda
    }
    
    // --- Jika Lolos Validasi dan Bukan Tebakan Ganda, LANJUTKAN ---

    // Tambahkan tebakan dan kurangi kesempatan
    previousGuesses.push(userGuess);
    guessesLeft--;

    // Perbarui Tampilan Stats
    guessesLeftDisplay.textContent = guessesLeft;
    prevGuessesDisplay.textContent = previousGuesses.join(', ');
    guessInput.value = ''; 
    guessInput.focus(); 

    // 3. LOGIKA PERMAINAN UTAMA
    if (userGuess === randomNumber) {
        // MENANG!
        Swal.fire({
            icon: 'success',
            title: ' 🎉 BRAVO! Kamu berhasil menebak angka! 💖',
            html: `Kamu jenius! Angka rahasia **${randomNumber}** terungkap hanya dalam ${MAX_GUESSES - guessesLeft} kali coba.`,
            confirmButtonText: 'Lagi!',
            confirmButtonColor: '#38761D'
        }).then((result) => {
            if (result.isConfirmed) {
                initGame();
            }
        });
        resultDisplay.textContent = `✨ WOW! Angka rahasianya adalah ${randomNumber}. Keren banget asli! 🎉`;
        resultDisplay.className = 'message feedback-win';
        gameOver(true);
    } else if (guessesLeft === 0) {
        // KALAH
        Swal.fire({
            icon: 'error',
            title: 'Game Over, Its Okey',
            html: `😭 Kesempatan habis. Angka rahasianya adalah **${randomNumber}**. Sedikit lagi!`,
            confirmButtonText: 'Coba Lagi ?',
            confirmButtonColor: '#FF5A73'
        }).then((result) => {
            if (result.isConfirmed) {
                initGame();
            }
        });
        resultDisplay.textContent = `😭 Yah, nyawa habis. Kesempatan mu berakhir. Angka rahasia: ${randomNumber}.`;
        resultDisplay.className = 'message feedback-lose';
        gameOver(false);
    } else {
        // BERI PETUNJUK (Ini yang tadi tidak muncul)
        if (userGuess < randomNumber) {
            resultDisplay.textContent = 'Terlalu Rendah. *Climb higher!*';
            resultDisplay.className = 'message feedback-low';
        } else { // userGuess > randomNumber
            resultDisplay.textContent = 'Terlalu Tinggi. *Bring it down.*';
            resultDisplay.className = 'message feedback-high';
        }
    }
}

// 4. Akhir Permainan
function gameOver(win) {
    guessInput.disabled = true;
    submitGuess.disabled = true;
    resetGameButton.classList.remove('hidden'); 
}


// --- Event Listeners ---

submitGuess.addEventListener('click', checkGuess);

guessInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); 
        checkGuess();
    }
});

resetGameButton.addEventListener('click', initGame);

// Mulai Permainan saat halaman dimuat
initGame();
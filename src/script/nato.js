const phoneticAlphabet = {
    A: "Alpha", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo",
    F: "Foxtrot", G: "Golf", H: "Hotel", I: "India", J: "Juliet",
    K: "Kilo", L: "Lima", M: "Mike", N: "November", O: "Oscar",
    P: "Papa", Q: "Quebec", R: "Romeo", S: "Sierra", T: "Tango",
    U: "Uniform", V: "Victor", W: "Whiskey", X: "X-ray", Y: "Yankee", Z: "Zulu",
    1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five",
    6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", 0: "Zero"
  };

  const inputField = document.getElementById('input-field');
  const outputContainer = document.getElementById('output-container');
  const outputText = document.getElementById('output-text');

  inputField.addEventListener('input', () => {
    const input = inputField.value.trim();
    if (!input) {
      outputContainer.style.visibility = 'hidden';
      return;
    }

    const hasAt = input.includes('@');
    const hasThreeNumbers = /\d{7}/.test(input);
    const hasSpace = input.includes(' ');

    if (hasAt) {
      outputText.innerHTML = formatEmail(input);
    } else if (hasThreeNumbers) {
      outputText.innerHTML = formatPhoneNumber(input);
    } else if (hasSpace) {
      const words = input.split(/\s+/);
      outputText.innerHTML = formatNames(words);
    } else {
      outputContainer.style.visibility = 'hidden';
      return;
    }

    outputContainer.style.visibility = 'visible';
  });

  function getPhonetic(char) {
    const specialCharacters = {
      '_': 'Underscore (_)',
      '.': 'Dot (.)',
      '$': 'Dollar Sign ($)',
      '@': 'At (@)',
      '-': 'Dash (-)',
      '+': 'Plus Sign (+)',
      '#': 'Hash (#)',
      '&': 'Ampersand (&)',
      '%': 'Percent (%)',
      '*': 'Asterisk (*)',
      '/': 'Slash (/)',
      '\\': 'Backslash (\\)'
    };

    // Return the phonetic alphabet or the special character name
    return specialCharacters[char] || phoneticAlphabet[char.toUpperCase()] || char;
  }

  function formatNames(words) {
    let result = `
                <div class="static-text">Just to verify, that was...</div>
                <div class="name-columns">
            `;

    words.forEach(word => {
      result += `
                    <div class="name-column">
                        <div class="static-text"><span class="dynamic-text">${word}</span>, spelled...</div>
                `;
      for (const char of word) {
        result += `
                        <div class="static-text"><span class="dynamic-text">${char.toUpperCase()}</span> as in <span class="dynamic-text">${getPhonetic(char)}</span></div>
                    `;
      }
      result += `</div>`; // Close name-column div
    });

    result += `</div>
                <div class="static-text">Is that correct?</div>`;
    return result;
  }

  function formatPhoneNumber(number) {
    const areaCode = number.slice(0, 3);
    const middle = number.slice(3, 6);
    const last = number.slice(6);
    let result = `
                <div class="static-text">To verify that phone number, I have area code</div>
                <div class="static-text">
                    ${areaCode.split('').map(d => `<span class="dynamic-text">${getPhonetic(d)}</span>`).join(', ')}
                </div>
                <div class="static-text">then</div>
                <div class="static-text">
                    ${middle.split('').map(d => `<span class="dynamic-text">${getPhonetic(d)}</span>`).join(', ')}
                </div>
                <div class="static-text">and last four is</div>
                <div class="static-text">
                    ${last.split('').map(d => `<span class="dynamic-text">${getPhonetic(d)}</span>`).join(', ')}
                </div>
                <div class="static-text">Is that correct?</div>
            `;
    return result;
  }

  function formatEmail(email) {
    const [local, domain] = email.split('@');
    let result = `
        <div class="static-text">To verify I have that email typed correctly,</div>
        <div class="static-text">that was <span class="dynamic-text">${local}</span>@<span class="dynamic-text">${domain}</span>, spelled...</div>
    `;

    // Format the local part of the email
    result += local.split('').map(char => {
      if (/\d/.test(char)) {
        return `<div class="static-text"><span class="dynamic-text">${getPhonetic(char)}</span></div>`;
      } else if (isSpecialCharacter(char)) {
        return `<div class="static-text"><span class="dynamic-text">${getPhonetic(char)}</span></div>`;
      }
      return `<div class="static-text"><span class="dynamic-text">${char.toUpperCase()}</span> as in <span class="dynamic-text">${getPhonetic(char)}</span></div>`;
    }).join('');

    // Append the domain part
    result += `
        <div class="static-text">@<span class="dynamic-text">${domain}</span>, is that correct?</div>
    `;

    return result;
  }

  function isSpecialCharacter(char) {
    const specialCharacters = '_.$@-+#&%*/\\';
    return specialCharacters.includes(char);
  }

  function getPhonetic(char) {
    const specialCharacters = {
      '_': 'Underscore (_)',
      '.': 'Dot (.)',
      '$': 'Dollar Sign ($)',
      '@': 'At (@)',
      '-': 'Dash (-)',
      '+': 'Plus Sign (+)',
      '#': 'Hash (#)',
      '&': 'Ampersand (&)',
      '%': 'Percent (%)',
      '*': 'Asterisk (*)',
      '/': 'Slash (/)',
      '\\': 'Backslash (\\)'
    };

    // Return the phonetic alphabet or the special character name
    return specialCharacters[char] || phoneticAlphabet[char.toUpperCase()] || char;
  }
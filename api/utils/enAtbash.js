export default function (message) {

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const tebahpla = "ZYXWVUTSRQPONMLKJIHGFEDCBA";
    const alphabet1 = "abcdefghijklmnopqrstuvwxyz";
    const tebahpla1 = "zyxwvutsrqponmlkjihgfedcba";
    let decoded_string = "";

    for (let i = 0; i < message.length; i++) {
        const coded_letra = message.charAt(i);

        if (/[^a-zA-Z]/.test(message[i])) {
            decoded_string = decoded_string + message[i];
        }
        else if (message[i] === message[i].toUpperCase()) {
            const letraPosMayus = alphabet.indexOf(coded_letra);
            const tebLetraPosMayus = tebahpla.charAt(letraPosMayus);
            decoded_string = decoded_string + tebLetraPosMayus;
        }
        else {
            const letraPosMinus1 = alphabet1.indexOf(coded_letra);
            const tebLetraPosMinus1 = tebahpla1.charAt(letraPosMinus1);
            decoded_string = decoded_string + tebLetraPosMinus1;
        }
    }

    return decoded_string;
}


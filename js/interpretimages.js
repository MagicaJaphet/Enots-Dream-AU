const imageLibrary = new Map();

fetch("/assets/images.txt")
.then((res) => { if (res.ok) { return res.text(); }})
.then((text) => {
    if (text && text.length > 0) {
        let lines = text.includes("\n") ? text.split("\n") : [text];
        lines.forEach((line) => {
            if (line && line.length > 0) {
                
            }
        });
    }
})

// https://lh3.googleusercontent.com/d/ID
console.log("Email Writer extension loaded successfully.");
function findComposeToolbar() {
   const selectors =[
    '.btC',
    '.aDh',
    '[role="toolbar"]',
    'gU.Up'

   ];
   for(const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if(toolbar) {
        return toolbar;
    }
    return null;
}
}
   function createAibutton() {
    const button = document.createElement('div');

    button.className =
        'T-J J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button';

    button.textContent = 'AI Reply';
    button.style.marginRight = '8px';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');

    return button;
}

function getEmailContent() {
    const selectors =[
        '.h7',
        '.a3s.aiL',
        'gmail_quote',
        '[role="presentation"]'
    ];
    for(const selector of selectors) {
        const content = document.querySelector(selector);
        if(content) {
            return content.innerText.trim();
        }
        return '';
    }
}

   function injectbutton() {
    const toolbar = findComposeToolbar();

    if (!toolbar) {
        return;
    }

    // Prevent duplicate buttons
    if (toolbar.querySelector('.ai-reply-button')) {
        return;
    }

    console.log("Injecting AI Reply button");

    const button = createAibutton();

    button.addEventListener('click', async () => {
        try {
            button.innerText = 'Generating...';

            const emailContent = getEmailContent();

            const response = await fetch(
                'http://localhost:9090/api/email/generate',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        emailContent,
                        tone: 'friendly'
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}`);
            }

            const generatedReply = await response.text();

            const composeBox =
                document.querySelector(
                    '[role="textbox"][g_editable="true"]'
                );

            if (composeBox) {
                composeBox.focus();

                document.execCommand(
                    'insertText',
                    false,
                    generatedReply.replace(/\\n/g, '\n')
                );
            }
        } catch (error) {
            console.error(error);
        } finally {
            button.innerText = 'AI Reply';
        }
    });

    toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
    for(const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node =>
             node.nodeType === Node.ELEMENT_NODE && 
             (node.matches('.aDh, .btC, [role="dialog"]') ||
             node.querySelector('.aDh, .btC, [role="dialog"]'))
            );
            if(hasComposeElements) {
                console.log("Compose elements detected. Injecting email writer button.");
                setTimeout(injectbutton, 500);
            }
    }

});
observer.observe(document.body, { childList: true, subtree: true });
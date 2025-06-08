// JavaScript for Nurse Karen
document.addEventListener('DOMContentLoaded', () => {
    const inputForm = document.getElementById('input-form');
    const userInput = document.getElementById('user-input');
    const chatLog = document.getElementById('chat-log');
    // Elements for Grievance Modal
    const showGrievanceFormBtn = document.getElementById('show-grievance-form-btn');
    const grievanceModal = document.getElementById('grievance-modal');
    const grievanceText = document.getElementById('grievance-text');
    const submitGrievanceBtn = document.getElementById('submit-grievance-btn');
    const cancelGrievanceBtn = document.getElementById('cancel-grievance-btn');
    const officialNotifications = document.getElementById('official-notifications');
    const notifyKenBtn = document.getElementById('notify-ken-btn');

    const insubordinationKeywords = ['wait', 'complaint', 'unfair', 'help', 'manager', 'rude', 'wrong'];
    let karenMentionCount = 0;
    let chatHistory = [];

    // Initial greeting from Nurse Karen
    // Moved from placeholder comment to actual implementation for Task 6 (My Persona)
    // and to ensure it's part of chatHistory for Task 12 (Report Generation)
    const initialGreetingText = "Nurse Karen speaking. Please make it quick, I have important matters to attend to.";
    const initialGreetingDiv = document.createElement('div');
    initialGreetingDiv.classList.add('karen-message');
    const greetingAvatar = document.createElement('div');
    greetingAvatar.classList.add('karen-avatar-placeholder');
    initialGreetingDiv.appendChild(greetingAvatar);
    const greetingTextSpan = document.createElement('span'); // Use a span for text next to avatar
    greetingTextSpan.textContent = initialGreetingText;
    initialGreetingDiv.appendChild(greetingTextSpan);
    if (chatLog) { // Ensure chatLog exists before appending
        chatLog.appendChild(initialGreetingDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
        // Add to chat history
        chatHistory.push({ speaker: "Nurse Karen", text: initialGreetingText, timestamp: new Date().toISOString() });
        console.log("Initial greeting added to chat history.");
    }


    async function getAiResponse(userMessageText) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const lowerMessage = userMessageText.toLowerCase();

        if (lowerMessage.includes("you are wrong")) {
            return { aiResponse: "How DARE you suggest I am wrong! I am a professional! This is UNACCEPTABLE!", sentimentScore: -0.8 };
        } else if (lowerMessage.includes("this is unfair")) {
            return { aiResponse: "Life isn't fair, dear. Perhaps if you'd read the hospital policy on 'fairness', you'd understand. (Bylaw 87-C, paragraph 3, subsection D, if you must know).", sentimentScore: -0.5 };
        } else if (lowerMessage.includes("thank you")) {
            return { aiResponse: "Well, it's about time someone showed some appreciation. Most people are so demanding.", sentimentScore: 0.5 };
        } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
            return { aiResponse: "Yes? State your purpose. I don't have all day for pleasantries.", sentimentScore: 0.1 };
        } else if (lowerMessage.includes("what is your name")) {
            return { aiResponse: "I am Nurse Karen, Head of Compliance and Patient Correspondence. And you are testing my patience.", sentimentScore: -0.1};
        }
         else {
            // Default response for anything else
            const genericResponses = [
                "I see. And what do you expect me to do about that?",
                "Your point being?",
                "Fascinating. Truly. Now, if you'll excuse me.",
                "That is noted. Or it will be, once I find a pen that works.",
                "Right. Is there anything else, or can I return to my extremely important duties?"
            ];
            const randomIndex = Math.floor(Math.random() * genericResponses.length);
            return { aiResponse: genericResponses[randomIndex], sentimentScore: 0.0 };
        }
    }

    inputForm.addEventListener('submit', async function(event) { // Changed to async for await
        event.preventDefault();
        const userMessageText = userInput.value.trim();

        if (userMessageText === '') return;

        // Detect /generatereport command
        if (userMessageText.trim().toLowerCase() === '/generatereport') {
            userInput.value = ''; // Clear the input field
            generateAndDisplayReport();
            return; // Prevent further processing as a normal message
        }

        // Add user message to chat history BEFORE displaying it (or just after getting text)
        chatHistory.push({ speaker: "User", text: userMessageText, timestamp: new Date().toISOString() });

        // Check for "Karen" mentions
        if (userMessageText.toLowerCase().includes('karen')) {
            karenMentionCount++;
            console.log("'Karen' mention count: ", karenMentionCount);
            if (karenMentionCount >= 3) {
                if(notifyKenBtn) notifyKenBtn.style.display = 'block';
                console.log("Notify Ken button revealed!");
            }
        }

        // Display user message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.classList.add('user-message');
        userMessageDiv.textContent = userMessageText;
        chatLog.appendChild(userMessageDiv);
        chatLog.scrollTop = chatLog.scrollHeight; // Scroll after user message

        // Check for insubordination (remains unchanged)
        const lowerUserMessage = userMessageText.toLowerCase();
        for (const keyword of insubordinationKeywords) {
            if (lowerUserMessage.includes(keyword)) {
                console.warn('Insubordination tendency logged for user input: "' + userMessageText + '" at ' + new Date().toISOString());
                // TODO: This is where compliance score would be affected in Task 7
                break;
            }
        }

        userInput.value = ''; // Clear input

        // Get My AI-powered response (simulated)
        try {
            const response = await getAiResponse(userMessageText); // Use await here

            const karenMessageDiv = document.createElement('div');
            karenMessageDiv.classList.add('karen-message');

            const responseAvatar = document.createElement('div');
            responseAvatar.classList.add('karen-avatar-placeholder');
            karenMessageDiv.appendChild(responseAvatar);

            const responseTextSpan = document.createElement('span'); // Use a span for text
            let finalResponseText = response.aiResponse;
            if (response.sentimentScore < -0.2) {
                finalResponseText = "(LOGGED FOR REVIEW) " + finalResponseText;
            }
            responseTextSpan.textContent = finalResponseText;
            karenMessageDiv.appendChild(responseTextSpan);

            chatLog.appendChild(karenMessageDiv);
            // Add Nurse Karen's response to chat history
            chatHistory.push({ speaker: "Nurse Karen", text: finalResponseText, timestamp: new Date().toISOString() });
            chatLog.scrollTop = chatLog.scrollHeight; // Scroll after my message
        } catch (error) {
            console.error("Error getting AI response:", error);
            // Fallback to a very generic error message for Karen if the AI fails
            const karenErrorDiv = document.createElement('div');
            karenErrorDiv.classList.add('karen-message');
            const errorAvatar = document.createElement('div');
            errorAvatar.classList.add('karen-avatar-placeholder');
            karenErrorDiv.appendChild(errorAvatar);
            const errorText = document.createElement('span');
            errorText.textContent = "There seems to be a system malfunction. Try again later, and don't be difficult.";
            karenErrorDiv.appendChild(errorText);
            chatLog.appendChild(karenErrorDiv);
            chatLog.scrollTop = chatLog.scrollHeight;
        }
    });

    // Grievance Modal Logic
    if (showGrievanceFormBtn) {
        showGrievanceFormBtn.addEventListener('click', () => {
            grievanceModal.style.display = 'block';
        });
    }

    if (cancelGrievanceBtn) {
        cancelGrievanceBtn.addEventListener('click', () => {
            grievanceModal.style.display = 'none';
            grievanceText.value = ''; // Clear the textarea
        });
    }

    if (submitGrievanceBtn) {
        submitGrievanceBtn.addEventListener('click', (event) => {
            // event.preventDefault(); // Not strictly necessary as it's not a form submit, but good practice
            const text = grievanceText.value.trim();
            if (text !== '') {
                const notificationDiv = document.createElement('div');
                // Basic sanitization for display - replace < and > to prevent HTML injection
                const sanitizedText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                notificationDiv.innerHTML = `<strong>GRIEVANCE FILED (${new Date().toLocaleTimeString()}):</strong> ${sanitizedText}`;
                notificationDiv.style.padding = '5px';
                notificationDiv.style.borderBottom = '1px solid #eee';
                notificationDiv.style.marginBottom = '5px';

                officialNotifications.insertBefore(notificationDiv, officialNotifications.firstChild);

                console.log("Grievance to be sent to backend: ", { timestamp: new Date().toISOString(), grievance: text });

                grievanceText.value = '';
                grievanceModal.style.display = 'none';
            } else {
                alert("A grievance cannot be empty. State your concerns properly and with due respect for my time!");
            }
        });
    }

    // Notify Ken Button Logic
    if (notifyKenBtn) {
        notifyKenBtn.addEventListener('click', () => {
            const warningDiv = document.createElement('div');
            warningDiv.className = 'ken-warning-message';
            warningDiv.innerHTML = "<strong>ATTENTION:</strong> FURTHER INSUBORDINATION WILL BE REPORTED TO MY HUSBAND, KEN. HE IS A VERY INFLUENTIAL MAN. CONSIDER YOURSELF WARNED.";

            // Style it like other notifications
            warningDiv.style.padding = '5px';
            warningDiv.style.borderBottom = '1px solid var(--alarm-red)'; // Use alarm red for consistency
            warningDiv.style.marginBottom = '5px';

            officialNotifications.insertBefore(warningDiv, officialNotifications.firstChild);
            console.log("Audio cue for Notify Ken: Low synth 'C2' + brown noise rustle. (Tone.js integration deferred).");
            // notifyKenBtn.style.display = 'none'; // Optionally hide after clicking
        });
    }

    function generateAndDisplayReport() {
        if (!officialNotifications) {
            console.error("Official notifications element not found!");
            alert("Critical error: Cannot display report. Contact support immediately (not me).");
            return;
        }
        if (chatHistory.length === 0) {
            alert("There is no chat history to report. Try interacting first, if you must.");
            return;
        }

        let reportContent = "OFFICIAL INCIDENT REPORT FOR IMMEDIATE ESCALATION TO HOSPITAL ADMINISTRATION:\n\n";
        reportContent += "Report Generated: " + new Date().toLocaleString() + "\n";
        reportContent += "Presiding Officer: Nurse Karen, Head of Compliance\n";
        reportContent += "--------------------------------------------------\n\n";

        chatHistory.forEach(entry => {
            const formattedTimestamp = new Date(entry.timestamp).toLocaleString();
            reportContent += `[${formattedTimestamp}] ${entry.speaker}: ${entry.text}\n`;
        });

        reportContent += "\n--------------------------------------------------\n";
        reportContent += "END OF REPORT. ACTION IS REQUIRED.\n";

        const reportDiv = document.createElement('div');
        reportDiv.style.whiteSpace = 'pre-wrap';
        reportDiv.style.fontFamily = 'monospace';
        reportDiv.style.border = '1px solid var(--authoritarian-charcoal)';
        reportDiv.style.padding = '10px';
        reportDiv.style.marginTop = '10px';
        reportDiv.style.backgroundColor = '#f0f0f0'; // Light grey background for the report itself
        reportDiv.textContent = reportContent;

        officialNotifications.insertBefore(reportDiv, officialNotifications.firstChild);
        console.log("Client-side report generated and displayed.");
        // console.log("Report content (chatHistory object) that would be sent to backend:", chatHistory);
    }
});

const { attach } = require('neovim');

async function createSplitWithText (userInput) 
{
    try 
    {
    // Attach to the Neovim instance
        const nvim = await attach({ socket: process.env.NVIM_LISTEN_ADDRESS });

        // Create a new buffer
        const buffer = await nvim.createBuffer(true, true); // Listed, scratch buffer

        // Generate dynamic text
        const timestamp = new Date().toLocaleString();
        const messages = [
            'Welcome to your dynamic split!',
            'This is a randomly chosen message.',
            'Generated just for you!',
            'Neovim and Node.js are awesome!'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const lines = [
            `Generated on: ${timestamp}`,
            `User input: ${userInput || 'No input provided'}`,
            randomMessage,
            'Feel free to edit this buffer or close the split.'
        ];

        // Set the generated text in the buffer
        await buffer.setLines(lines, { start: 0, end: -1 });

        // Open a new vertical split and set the buffer
        await nvim.command('vsplit');
        const window = await nvim.window;
        await window.setBuffer(buffer);

        // Notify success
        await nvim.command('echom "Dynamic split created successfully!"');

        // Clean up
        nvim.quit();
    }
    catch (err) 
    {
        console.error('Error:', err);
    }
}

// Read the user input from command-line arguments (process.argv[2])
const userInput = process.argv[2] || '';
createSplitWithText(userInput);

 // DOM Elements
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        const navItems = document.querySelectorAll('.menu-item');
        const submenuItems = document.querySelectorAll('.submenu-item');
        const contentPages = document.querySelectorAll('.content-page');
        const contentContainers = document.querySelectorAll('.content-container');
        const exerciseContainers = document.querySelectorAll('.exercise-container');
        const hasSubmenuItems = document.querySelectorAll('.has-submenu');
        
        // Code Editor Elements
        const codeEditor = document.getElementById('codeEditor');
        const outputFrame = document.getElementById('outputFrame');
        const runEditorBtn = document.getElementById('runEditorBtn');
        const saveBtn = document.getElementById('saveBtn');
        const clearBtn = document.getElementById('clearBtn');
        const languageSelect = document.getElementById('languageSelect');
        const fileNameInput = document.getElementById('fileName');
        
        // Toggle Sidebar on Mobile
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
        
        // Handle Navigation
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Check if item has submenu
                if (this.classList.contains('has-submenu')) {
                    const submenu = this.nextElementSibling;
                    const chevron = this.querySelector('.chevron');
                    
                    submenu.classList.toggle('active');
                    chevron.classList.toggle('rotate');
                    return;
                }
                
                // Get page to show
                const pageId = this.getAttribute('data-page');
                if (!pageId) return;
                
                // Update active states
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                // Show selected page
                contentPages.forEach(page => page.classList.remove('active'));
                document.getElementById(pageId).classList.add('active');
                
                // Close sidebar on mobile after selection
                if (window.innerWidth <= 992) {
                    sidebar.classList.remove('active');
                }
                
                // Handle submenu content display
                if (pageId === 'tutorials' || pageId === 'references') {
                    // Show first content container by default
                    contentContainers.forEach(container => container.classList.remove('active'));
                    const firstContainer = document.querySelector(`#${pageId} .content-container`);
                    if (firstContainer) firstContainer.classList.add('active');
                    
                    // Activate first submenu item
                    const submenu = document.getElementById(`${pageId}-submenu`);
                    if (submenu) {
                        submenuItems.forEach(item => item.classList.remove('active'));
                        const firstSubmenuItem = submenu.querySelector('.submenu-item');
                        if (firstSubmenuItem) firstSubmenuItem.classList.add('active');
                    }
                } else if (pageId === 'exercises') {
                    // Show first exercise container by default
                    exerciseContainers.forEach(container => container.classList.remove('active'));
                    const firstExerciseContainer = document.querySelector('#exercises .exercise-container');
                    if (firstExerciseContainer) firstExerciseContainer.classList.add('active');
                    
                    // Activate first submenu item
                    const submenu = document.getElementById(`${pageId}-submenu`);
                    if (submenu) {
                        submenuItems.forEach(item => item.classList.remove('active'));
                        const firstSubmenuItem = submenu.querySelector('.submenu-item');
                        if (firstSubmenuItem) firstSubmenuItem.classList.add('active');
                    }
                }
            });
        });
        
        // Handle Submenu Item Click
        submenuItems.forEach(item => {
            item.addEventListener('click', function() {
                // Update active states
                const parentSubmenu = this.parentElement;
                parentSubmenu.querySelectorAll('.submenu-item').forEach(i => {
                    i.classList.remove('active');
                });
                this.classList.add('active');
                
                // Get content to show
                const contentId = this.getAttribute('data-content');
                
                // Show corresponding content
                if (contentId.includes('tutorial') || contentId.includes('reference')) {
                    contentContainers.forEach(container => container.classList.remove('active'));
                    document.getElementById(contentId).classList.add('active');
                } else if (contentId.includes('exercises')) {
                    exerciseContainers.forEach(container => container.classList.remove('active'));
                    document.getElementById(contentId).classList.add('active');
                }
                
                // Close sidebar on mobile after selection
                if (window.innerWidth <= 992) {
                    sidebar.classList.remove('active');
                }
            });
        });
        
        // Code Editor Functionality
        runEditorBtn.addEventListener('click', runEditorCode);
        saveBtn.addEventListener('click', saveEditorCode);
        clearBtn.addEventListener('click', clearEditorCode);
        
        function runEditorCode() {
            const code = codeEditor.value;
            
            // Create a complete HTML document with the code
            const htmlDoc = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Code Output</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            padding: 20px; 
                            margin: 0;
                            background-color: #f5f5f5;
                        }
                        * {
                            box-sizing: border-box;
                        }
                    </style>
                </head>
                <body>
                    ${code}
                </body>
                </html>
            `;
            
            // Write the HTML to the iframe
            const iframeDoc = outputFrame.contentDocument || outputFrame.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(htmlDoc);
            iframeDoc.close();
        }
        
        function saveEditorCode() {
            const code = codeEditor.value;
            const fileName = fileNameInput.value || 'code.html';
            const language = languageSelect.value;
            
            const blob = new Blob([code], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            
            showNotification('Code saved successfully!');
        }
        
        function clearEditorCode() {
            if (confirm('Are you sure you want to clear the editor?')) {
                codeEditor.value = '';
                const iframeDoc = outputFrame.contentDocument || outputFrame.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write('');
                iframeDoc.close();
                
                showNotification('Editor cleared!');
            }
        }
        
        // Exercise Functions
        function runExercise(textareaId) {
            const code = document.getElementById(textareaId).value;
            const tempWindow = window.open();
            tempWindow.document.write(code);
            tempWindow.document.close();
        }
        
        function checkExercise(textareaId, language, exerciseNum) {
            const code = document.getElementById(textareaId).value;
            const resultBox = document.getElementById(`result-${language}-${exerciseNum}`);
            
            // Define correct answers for exercises
            const solutions = {
                'html': {
                    1: /<h1>.*Welcome to DevHub.*<\/h1>/i,
                    2: /<p>.*This is my first HTML exercise.*<\/p>/i,
                    3: /<a.*href=.*https:\/\/www\.devhub\.com.*>.*Visit DevHub.*<\/a>/i
                },
                'css': {
                    1: /color:\s*red/i,
                    2: /background-color:\s*lightblue/i
                },
                'javascript': {
                    1: /(let|var|const)\s+message\s*=\s*["']Hello, JavaScript!["']/i,
                    2: /function\s+greet\s*\(\s*\)\s*\{[\s\S]*return\s+["']Hello, World!["'][\s\S]*\}/i
                }
            };
            
            // Check if code matches solution
            const solution = solutions[language]?.[exerciseNum];
            if (solution && solution.test(code)) {
                resultBox.className = 'result-box success';
                resultBox.innerHTML = '<i class="fas fa-check-circle"></i> Correct! Well done!';
                
                // Update progress
                updateExerciseProgress(language, exerciseNum);
            } else {
                resultBox.className = 'result-box error';
                resultBox.innerHTML = '<i class="fas fa-times-circle"></i> Incorrect. Try again!';
            }
            
            // Scroll to result
            resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        function showSolution(language, exerciseNum) {
            const solutions = {
                'html': {
                    1: '<h1>Welcome to DevHub</h1>',
                    2: '<p>This is my first HTML exercise.</p>',
                    3: '<a href="https://www.devhub.com">Visit DevHub</a>'
                },
                'css': {
                    1: 'color: red;',
                    2: 'background-color: lightblue;'
                },
                'javascript': {
                    1: 'let message = "Hello, JavaScript!";',
                    2: 'function greet() {\n    return "Hello, World!";\n}'
                }
            };
            
            const solution = solutions[language]?.[exerciseNum];
            if (solution) {
                alert(`Solution for ${language.toUpperCase()} Exercise ${exerciseNum}:\n\n${solution}`);
            }
        }
        
        function updateExerciseProgress(language, exerciseNum) {
            // In a real app, you would save this to localStorage or a backend
            console.log(`Exercise ${exerciseNum} completed for ${language}`);
        }
        
        // Notification function
        function showNotification(message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(to right, var(--primary), var(--secondary));
                color: var(--dark-header);
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: var(--shadow);
                z-index: 10000;
                animation: slideInRight 0.3s, fadeOut 0.3s 2.7s;
                font-weight: 500;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
        
        // Logout functionality
        document.querySelector('.logout-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                showNotification('Logged out successfully!');
                // In a real app, you would redirect to login page
                // window.location.href = 'index.html';
            }
        });
        
        // Initialize the page
        document.addEventListener('DOMContentLoaded', () => {
            // Run code editor on load
            setTimeout(runEditorCode, 500);
            
            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', (event) => {
                if (window.innerWidth <= 992 && 
                    !sidebar.contains(event.target) && 
                    !menuToggle.contains(event.target) &&
                    sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
            });
            
            // Syntax highlighting for code editor
            codeEditor.addEventListener('input', function() {
                // Basic syntax highlighting would be implemented here
                // In a real app, you would use a library like Prism.js or Highlight.js
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992) {
                sidebar.classList.remove('active');
            }
        });
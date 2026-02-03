// Initialize CodeMirror editors
        const htmlEditor = CodeMirror.fromTextArea(document.getElementById('htmlCode'), {
            mode: "htmlmixed",
            theme: "default",
            lineNumbers: true,
            lineWrapping: true,
            autoCloseTags: true,
            matchBrackets: true
        });
        
        const cssEditor = CodeMirror.fromTextArea(document.getElementById('cssCode'), {
            mode: "css",
            theme: "default",
            lineNumbers: true,
            lineWrapping: true,
            matchBrackets: true
        });
        
        const jsEditor = CodeMirror.fromTextArea(document.getElementById('jsCode'), {
            mode: "javascript",
            theme: "default",
            lineNumbers: true,
            lineWrapping: true,
            matchBrackets: true
        });
        
        // Update line counts
        function updateLineCounts() {
            document.getElementById('htmlLines').textContent = `Lines: ${htmlEditor.lineCount()}`;
            document.getElementById('cssLines').textContent = `Lines: ${cssEditor.lineCount()}`;
            document.getElementById('jsLines').textContent = `Lines: ${jsEditor.lineCount()}`;
        }
        
        // Set initial line counts
        updateLineCounts();
        
        // Update line counts when editors change
        htmlEditor.on('change', updateLineCounts);
        cssEditor.on('change', updateLineCounts);
        jsEditor.on('change', updateLineCounts);
        
        // Theme selector
        const themeSelect = document.getElementById('themeSelect');
        themeSelect.addEventListener('change', function() {
            const theme = this.value;
            htmlEditor.setOption('theme', theme);
            cssEditor.setOption('theme', theme);
            jsEditor.setOption('theme', theme);
        });
        
        // Run code button
        document.getElementById('runBtn').addEventListener('click', runCode);
        
        // Save button
        document.getElementById('saveBtn').addEventListener('click', saveCurrentCode);
        
        // New file button
        document.getElementById('newFileBtn').addEventListener('click', showNewFileModal);
        
        // View files button
        document.getElementById('viewFilesBtn').addEventListener('click', loadFiles);
        
        // Modal buttons
        document.getElementById('cancelBtn').addEventListener('click', hideNewFileModal);
        document.getElementById('newFileForm').addEventListener('submit', createNewFile);
        
        // Run code function
        function runCode() {
            const outputFrame = document.getElementById('outputFrame');
            const html = htmlEditor.getValue();
            const css = cssEditor.getValue();
            const js = jsEditor.getValue();
            
            // Create a complete HTML document with the code
            const fullHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>${css}</style>
                </head>
                <body>
                    ${html}
                    <script>${js}<\/script>
                </body>
                </html>
            `;
            
            // Clear and set new content
            outputFrame.innerHTML = '';
            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            outputFrame.appendChild(iframe);
            
            // Write the content to the iframe
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(fullHtml);
            iframeDoc.close();
            
            // Update status
            document.getElementById('outputStatus').textContent = 'Running...';
            document.getElementById('outputStatus').style.color = '#4CAF50';
            
            setTimeout(() => {
                document.getElementById('outputStatus').textContent = 'Executed Successfully';
            }, 500);
            
            showNotification('Code executed successfully!', 'success');
        }
        
        // File storage using localStorage
        let files = JSON.parse(localStorage.getItem('webcodeeditor_files')) || [];
        
        // Initialize with default files if empty
        if (files.length === 0) {
            files = [
                { id: 1, name: 'index.html', type: 'html', content: htmlEditor.getValue(), createdAt: new Date().toISOString() },
                { id: 2, name: 'style.css', type: 'css', content: cssEditor.getValue(), createdAt: new Date().toISOString() },
                { id: 3, name: 'script.js', type: 'js', content: jsEditor.getValue(), createdAt: new Date().toISOString() }
            ];
            localStorage.setItem('webcodeeditor_files', JSON.stringify(files));
        }
        
        // Save current code as separate files
        function saveCurrentCode() {
            // Update existing files or create new ones
            const htmlFile = files.find(f => f.name === 'index.html') || { id: Date.now(), name: 'index.html', type: 'html', createdAt: new Date().toISOString() };
            htmlFile.content = htmlEditor.getValue();
            htmlFile.updatedAt = new Date().toISOString();
            if (!files.find(f => f.name === 'index.html')) files.push(htmlFile);
            
            const cssFile = files.find(f => f.name === 'style.css') || { id: Date.now(), name: 'style.css', type: 'css', createdAt: new Date().toISOString() };
            cssFile.content = cssEditor.getValue();
            cssFile.updatedAt = new Date().toISOString();
            if (!files.find(f => f.name === 'style.css')) files.push(cssFile);
            
            const jsFile = files.find(f => f.name === 'script.js') || { id: Date.now(), name: 'script.js', type: 'js', createdAt: new Date().toISOString() };
            jsFile.content = jsEditor.getValue();
            jsFile.updatedAt = new Date().toISOString();
            if (!files.find(f => f.name === 'script.js')) files.push(jsFile);
            
            // Save to localStorage
            localStorage.setItem('webcodeeditor_files', JSON.stringify(files));
            
            // Update file list
            loadFiles();
            
            // Show notification
            showNotification('All files saved successfully!', 'success');
        }
        
        // Load and display files
        function loadFiles() {
            const filesList = document.getElementById('filesList');
            
            if (files.length === 0) {
                filesList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-folder-open"></i>
                        <h3>No Files Saved Yet</h3>
                        <p>Create your first file to get started</p>
                    </div>
                `;
                return;
            }
            
            filesList.innerHTML = files.map(file => `
                <div class="file-item">
                    <div class="file-info">
                        <div class="file-name">${file.name}</div>
                        <div class="file-type">${file.type.toUpperCase()}</div>
                        <div class="file-date">${new Date(file.updatedAt || file.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div class="file-actions">
                        <button class="file-action-btn" onclick="loadFileToEditor(${file.id})" title="Load">
                            <i class="fas fa-folder-open"></i>
                        </button>
                        <button class="file-action-btn" onclick="deleteFile(${file.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
        
        // Load a file into the appropriate editor
        function loadFileToEditor(fileId) {
            const file = files.find(f => f.id === fileId);
            if (!file) return;
            
            switch(file.type) {
                case 'html':
                    htmlEditor.setValue(file.content);
                    break;
                case 'css':
                    cssEditor.setValue(file.content);
                    break;
                case 'js':
                    jsEditor.setValue(file.content);
                    break;
                default:
                    // For other file types, prompt user to select which editor to load into
                    const choice = prompt(`Load "${file.name}" into which editor? (html/css/js)`);
                    if (choice === 'html') htmlEditor.setValue(file.content);
                    else if (choice === 'css') cssEditor.setValue(file.content);
                    else if (choice === 'js') jsEditor.setValue(file.content);
            }
            
            showNotification(`"${file.name}" loaded successfully!`, 'success');
        }
        
        // Delete a file
        function deleteFile(fileId) {
            if (!confirm('Are you sure you want to delete this file?')) return;
            
            files = files.filter(f => f.id !== fileId);
            localStorage.setItem('webcodeeditor_files', JSON.stringify(files));
            loadFiles();
            showNotification('File deleted successfully!', 'success');
        }
        
        // Show new file modal
        function showNewFileModal() {
            document.getElementById('newFileModal').style.display = 'flex';
            document.getElementById('fileName').focus();
        }
        
        // Hide new file modal
        function hideNewFileModal() {
            document.getElementById('newFileModal').style.display = 'none';
            document.getElementById('newFileForm').reset();
        }
        
        // Create a new file
        function createNewFile(e) {
            e.preventDefault();
            
            const fileName = document.getElementById('fileName').value;
            const fileType = document.getElementById('fileType').value;
            const fileContent = document.getElementById('fileContent').value;
            
            // Check if file with same name already exists
            if (files.some(f => f.name === fileName)) {
                showNotification(`A file named "${fileName}" already exists!`, 'error');
                return;
            }
            
            // Create new file object
            const newFile = {
                id: Date.now(),
                name: fileName,
                type: fileType,
                content: fileContent,
                createdAt: new Date().toISOString()
            };
            
            // Add to files array
            files.push(newFile);
            
            // Save to localStorage
            localStorage.setItem('webcodeeditor_files', JSON.stringify(files));
            
            // Update file list
            loadFiles();
            
            // Hide modal and show notification
            hideNewFileModal();
            showNotification(`"${fileName}" created successfully!`, 'success');
        }
        
        // Show notification
        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            const notificationText = document.getElementById('notificationText');
            
            notificationText.textContent = message;
            notification.className = `notification ${type}`;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
        
        // Initialize file list on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadFiles();
            // Run code initially to show preview
            setTimeout(runCode, 500);
        });
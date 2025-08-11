class SkillsManager {
    constructor() {
        this.skills = [];
        
        this.loadSkills().then(() => {
            this.populateSkillsList();
            this.loadProjects();
        });
    }
    
    async loadSkills() {
        try {
            const response = await fetch('skills.txt');
            if (!response.ok) {
                throw new Error(`Failed to load skills: ${response.status}`);
            }
            const text = await response.text();
            this.skills = text.split('\n')
                .map(skill => skill.trim())
                .filter(skill => skill.length > 0); // Remove empty lines
        } catch (error) {
            // Fallback to default skills if file loading fails
            this.skills = [
                'JavaScript', 'React', 'Node.js', 'Python', 'HTML/CSS',
                'TypeScript', 'Vue.js', 'Express.js', 'MongoDB', 'PostgreSQL',
                'Git', 'Docker', 'AWS', 'REST APIs', 'GraphQL',
                'Webpack', 'Jest', 'CI/CD', 'Agile', 'UI/UX',
                'Responsive Design', 'Performance', 'Security', 'Testing', 'Deployment'
            ];
        }
    }
    
    populateSkillsList() {
        const skillsGrid = document.querySelector('.skills-grid');
        skillsGrid.innerHTML = '';
        
        this.skills.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.innerHTML = `<h3>${skill}</h3>`;
            skillsGrid.appendChild(skillItem);
        });
    }
    
    async loadProjects() {
        try {
            // Add timestamp to prevent caching
            const timestamp = new Date().getTime();
            const response = await fetch(`projects.csv?t=${timestamp}`);
            if (!response.ok) {
                throw new Error(`Failed to load projects: ${response.status}`);
            }
            const csvText = await response.text();
            const projects = this.parseCSV(csvText);
            
            // Check URL health for all projects
            const projectsWithHealth = await this.checkAllProjectUrls(projects);
            this.displayProjects(projectsWithHealth);
        } catch (error) {
            this.displayProjects([]);
        }
    }
    
    async checkUrlHealth(url) {
        try {
            console.log(`Checking URL health for: ${url}`);
            
            // Use PHP endpoint to check URL health via curl
            const response = await fetch(`check-url.php?url=${encodeURIComponent(url)}`);
            
            if (!response.ok) {
                console.log(`PHP endpoint error for ${url}:`, response.status);
                return { isHealthy: false, error: `PHP endpoint error: ${response.status}` };
            }
            
            const result = await response.json();
            console.log(`Health check result for ${url}:`, result);
            
            if (result.error) {
                console.log(`URL ${url} has error:`, result.error);
                return { isHealthy: false, error: result.error };
            }
            
            // Return the result from PHP
            return {
                isHealthy: result.isHealthy,
                status: result.status,
                error: result.error
            };
            
        } catch (error) {
            console.log(`URL ${url} check failed:`, error.message);
            return { isHealthy: false, error: error.message };
        }
    }
    
    async checkAllProjectUrls(projects) {
        const healthChecks = await Promise.allSettled(
            projects.map(async (project) => {
                const health = await this.checkUrlHealth(project.url);
                return { ...project, health };
            })
        );
        
        return healthChecks.map(result => 
            result.status === 'fulfilled' ? result.value : { ...result.reason, health: { isHealthy: false, error: 'Check failed' } }
        );
    }
    
    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');
        const projects = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            
            // Simple CSV parsing - split on comma but be careful with quoted values
            let values = [];
            let current = '';
            let inQuotes = false;
            
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            values.push(current.trim()); // Add the last value
            
            if (values.length >= 3) {
                projects.push({
                    title: values[0].trim(),
                    url: values[1].trim(),
                    icon: values[2].trim()
                });
            } else if (values.length >= 2) {
                // Fallback for projects without custom icons
                projects.push({
                    title: values[0].trim(),
                    url: values[1].trim(),
                    icon: this.getRandomIcon()
                });
            }
        }
        
        return projects;
    }
    
    getRandomIcon() {
        const icons = ['🚀', '💻', '🌐', '📱', '⚡', '🔧', '🎨', '📊', '🔐', '📈'];
        return icons[Math.floor(Math.random() * icons.length)];
    }
    
    getIconFromText(text) {
        const iconMap = {
            // Portfolio & Personal
            'cv': '📄',
            'portfolio': '🌐',
            'personal': '👤',
            'resume': '📋',
            
            // E-commerce & Business
            'shop': '🛒',
            'store': '🏪',
            'ecommerce': '🛍️',
            'business': '💼',
            'marketplace': '🏬',
            
            // Mobile & Apps
            'app': '📱',
            'mobile': '📱',
            'ios': '🍎',
            'android': '🤖',
            'game': '🎮',
            
            // Web & Development
            'website': '🌐',
            'web': '🌐',
            'frontend': '🎨',
            'backend': '⚙️',
            'api': '🔌',
            'tool': '🔧',
            'library': '📚',
            'framework': '🏗️',
            
            // Data & Analytics
            'dashboard': '📊',
            'analytics': '📈',
            'data': '💾',
            'chart': '📊',
            'metrics': '📊',
            'reporting': '📋',
            
            // Content & CMS
            'cms': '📝',
            'blog': '✍️',
            'content': '📄',
            'editor': '✏️',
            'publishing': '📰',
            
            // Social & Communication
            'social': '👥',
            'chat': '💬',
            'messaging': '💌',
            'forum': '💭',
            'community': '🏘️',
            
            // Security & Authentication
            'security': '🔐',
            'auth': '🔑',
            'login': '🚪',
            'encryption': '🔒',
            
            // Cloud & Infrastructure
            'cloud': '☁️',
            'saas': '🚀',
            'server': '🖥️',
            'deployment': '🚀',
            'hosting': '🏠',
            
            // AI & Machine Learning
            'ai': '🤖',
            'ml': '🧠',
            'machine learning': '🧠',
            'neural': '🧠',
            
            // Other Common Types
            'weather': '🌤️',
            'calendar': '📅',
            'todo': '✅',
            'task': '📋',
            'project': '📁',
            'file': '📄',
            'search': '🔍',
            'filter': '🔍',
            'form': '📝',
            'survey': '📊',
            'quiz': '❓',
            'test': '🧪',
            'demo': '🎬',
            'prototype': '🔬',
            'beta': '🧪'
        };
        
        // Convert to lowercase for case-insensitive matching
        const lowerText = text.toLowerCase().trim();
        
        // Try exact match first
        if (iconMap[lowerText]) {
            return iconMap[lowerText];
        }
        
        // Try partial matching for longer descriptions
        for (const [key, icon] of Object.entries(iconMap)) {
            if (lowerText.includes(key) || key.includes(lowerText)) {
                return icon;
            }
        }
        
        // Fallback to random icon if no match found
        return this.getRandomIcon();
    }
    
    displayProjects(projects) {
        const projectsGrid = document.getElementById('projectsGrid');
        
        if (projects.length === 0) {
            projectsGrid.innerHTML = '<div class="project-card"><h3>No projects available</h3><p>Projects will be added soon...</p></div>';
            return;
        }
        
        projectsGrid.innerHTML = '';
        
        projects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            // Check if the project URL is healthy
            if (project.health && !project.health.isHealthy) {
                // Broken link - add broken-link class and make it unclickable
                projectCard.classList.add('broken-link');
                projectCard.innerHTML = `
                    <div class="project-icon">${this.getIconFromText(project.icon)}</div>
                    <h3>${project.title}</h3>
                    <div class="project-url">${project.url}</div>
                    <div class="project-status">Status: Unreachable</div>
                `;
            } else {
                // Healthy link - make it clickable
                projectCard.style.cursor = 'pointer';
                projectCard.addEventListener('click', () => {
                    window.open(project.url, '_blank', 'noopener,noreferrer');
                });
                projectCard.innerHTML = `
                    <div class="project-icon">${this.getIconFromText(project.icon)}</div>
                    <h3>${project.title}</h3>
                    <div class="project-url">${project.url}</div>
                `;
            }
            
            projectsGrid.appendChild(projectCard);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SkillsManager();
}); 
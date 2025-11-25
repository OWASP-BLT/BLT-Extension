// GitHub Rate Limit Display
// Shows remaining GitHub API rate limit requests on GitHub pages

(function() {
    'use strict';

    let refreshInterval = null;

    // Function to fetch and display rate limit info
    async function fetchAndDisplayRateLimit() {
        try {
            const response = await fetch('https://api.github.com/rate_limit');
            const data = await response.json();
            
            if (data && data.rate) {
                displayRateLimitBadge(data.rate);
            }
        } catch (error) {
            console.error('BLT Extension: Error fetching GitHub rate limit:', error);
            displayErrorBadge();
        }
    }

    // Function to display error badge
    function displayErrorBadge() {
        const existingBadge = document.getElementById('blt-rate-limit-badge');
        if (existingBadge) {
            existingBadge.style.backgroundColor = '#6e7681';
            existingBadge.querySelector('span:last-child').textContent = 'API: Error';
        }
    }

    // Function to create and display the rate limit badge
    function displayRateLimitBadge(rateData) {
        // Remove existing badge if present
        const existingBadge = document.getElementById('blt-rate-limit-badge');
        if (existingBadge) {
            existingBadge.remove();
        }

        const remaining = rateData.remaining;
        const limit = rateData.limit;
        const resetTime = new Date(rateData.reset * 1000);
        
        // Determine color based on remaining requests
        let badgeColor = '#238636'; // Green
        if (remaining < limit * 0.2) {
            badgeColor = '#da3633'; // Red - low remaining
        } else if (remaining < limit * 0.5) {
            badgeColor = '#d29922'; // Yellow - medium remaining
        }

        // Create badge element
        const badge = document.createElement('div');
        badge.id = 'blt-rate-limit-badge';
        badge.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: ${badgeColor};
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            font-size: 12px;
            font-weight: 500;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        // GitHub API icon (SVG)
        const icon = document.createElement('span');
        icon.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
        `;
        badge.appendChild(icon);

        // Rate limit text
        const text = document.createElement('span');
        text.textContent = `API: ${remaining}/${limit}`;
        badge.appendChild(text);

        // Create tooltip with more details
        const tooltip = document.createElement('div');
        tooltip.id = 'blt-rate-limit-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            bottom: 60px;
            right: 20px;
            background-color: #161b22;
            color: #c9d1d9;
            padding: 12px 16px;
            border-radius: 8px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            font-size: 12px;
            z-index: 9998;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            display: none;
            min-width: 200px;
            border: 1px solid #30363d;
        `;
        
        const resetTimeFormatted = resetTime.toLocaleTimeString();
        tooltip.innerHTML = `
            <div style="margin-bottom: 8px; font-weight: 600; color: #58a6ff;">GitHub API Rate Limit</div>
            <div style="margin-bottom: 4px;">Remaining: <strong>${remaining}</strong> / ${limit}</div>
            <div style="margin-bottom: 4px;">Resets at: <strong>${resetTimeFormatted}</strong></div>
            <div style="color: #8b949e; font-size: 11px; margin-top: 8px;">Unauthenticated requests</div>
            <div style="color: #8b949e; font-size: 11px; margin-top: 4px;">Powered by OWASP BLT Extension</div>
        `;

        // Add hover effect
        badge.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
            badge.style.transform = 'translateY(-2px)';
            badge.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
        });

        badge.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
            badge.style.transform = 'translateY(0)';
            badge.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });

        // Click to refresh
        badge.addEventListener('click', () => {
            badge.style.opacity = '0.5';
            fetchAndDisplayRateLimit()
                .then(() => {
                    badge.style.opacity = '1';
                })
                .catch(() => {
                    badge.style.opacity = '1';
                });
        });

        // Add to page
        document.body.appendChild(badge);
        document.body.appendChild(tooltip);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fetchAndDisplayRateLimit);
    } else {
        fetchAndDisplayRateLimit();
    }

    // Refresh rate limit every 5 minutes
    refreshInterval = setInterval(fetchAndDisplayRateLimit, 5 * 60 * 1000);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }
    });
})();

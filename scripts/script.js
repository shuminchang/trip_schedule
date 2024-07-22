document.addEventListener('DOMContentLoaded', () => {
    fetch('./data/schedule.json')
        .then(response => response.json())
        .then(data => {
            const scheduleContainer = document.getElementById('schedule-container');
            const today = new Date();

            data.schedule.forEach(day => {
                const section = document.createElement('section');
                const h2 = document.createElement('h2');
                h2.textContent = day.date;
                section.appendChild(h2);

                const ul = document.createElement('ul');
                let containsOsaka = false;

                day.events.forEach(event => {
                    const li = document.createElement('li');
                    const details = document.createElement('details');
                    if (event.important) {
                        details.classList.add('important');
                    }
                    const summary = document.createElement('summary');
                    summary.innerHTML = `${getEventIcon(event.description)} ${event.time ? `${event.time}: ` : ''}${event.description}`;
                    details.appendChild(summary);

                    event.details.forEach(detail => {
                        const p = document.createElement('p');
                        p.textContent = detail;
                        details.appendChild(p);
                        if (detail.includes('大阪')) {
                            containsOsaka = true;
                        }
                    });

                    li.appendChild(details);
                    ul.appendChild(li);
                });

                section.appendChild(ul);
                scheduleContainer.appendChild(section);

                // Initialize SortableJS on the <ul> element
                // new Sortable(ul, {
                //     animation: 150,
                //     ghostClass: 'sortable-ghost'
                // });

                // Expand section if it's today's date
                const sectionDate = new Date(day.date);
                if (sectionDate.toDateString() === today.toDateString()) {
                    section.classList.add('expanded');
                } else {
                    section.classList.add('collapsed');
                }

                // Add event listener to toggle section visibility
                h2.addEventListener('click', () => {
                    section.classList.toggle('expanded');
                    section.classList.toggle('collapsed');
                });

                // Set background image for sections containing Osaka
                if (containsOsaka) {
                    h2.style.backgroundImage = "url('./images/osaka-image.jpg')";
                }
            });

        })
        .catch(error => console.error('Error loading schedule:', error));
});

function getEventIcon(description) {
    const iconMappings = [
        { regex: /(機|飛)/i, icon: '<i class="fas fa-plane"></i>' },
        { regex: /(渡輪|船)/i, icon: '<i class="fas fa-ship"></i>' },
        { regex: /(車|新幹線|JR)/i, icon: '<i class="fas fa-train"></i>' },
    ];

    for (const mapping of iconMappings) {
        if (mapping.regex.test(description)) {
            return mapping.icon;
        }
    }

    return '';
}
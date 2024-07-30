$(document).ready(function() {
    $.getJSON('./data/schedule.json', function(data) {
        const $scheduleContainer = $('#schedule-container');
        const today = new Date();

        data.schedule.forEach(function(day) {
            const $section = $('<section>');
            const $h2 = $('<h2>').text(day.date);
            $section.append($h2);

            const $ul = $('<ul>');
            let containsOsaka = false;

            day.events.forEach(function(event) {
                const $li = $('<li>');
                const $details = $('<details>');
                if (event.important) {
                    $details.addClass('important');
                }
                const $summary = $('<summary>').html(`${getEventIcon(event.description)} ${event.time ? `${event.time}: ` : ''}${event.description}`);
                $details.append($summary);

                event.details.forEach(function(detail) {
                    if (typeof detail === 'object' && detail.restaurants) {
                        const $restaurantLabel = $('<p>').text('餐廳:');
                        $details.append($restaurantLabel);

                        const $restaurantUl = $('<ul>');
                        detail.restaurants.forEach(function(restaurant) {
                            const $restaurantLi = $('<li>');
                            const $a = $('<a>').attr('href', restaurant.url).text(restaurant.name);
                            $restaurantLi.append($a);
                            $restaurantUl.append($restaurantLi);
                        });
                        $details.append($restaurantUl);
                    } else {
                        const $p = $('<p>').text(detail);
                        $details.append($p);
                    }
                    if (typeof detail === 'string' && detail.includes('大阪')) {
                        containsOsaka = true;
                    }
                });

                $li.append($details);
                $ul.append($li);
            });

            $section.append($ul);
            $scheduleContainer.append($section);

            // Initialize SortableJS on the <ul> element
            // new Sortable(ul, {
            //     animation: 150,
            //     ghostClass: 'sortable-ghost'
            // });

            // Expand section if it's today's date
            const sectionDate = new Date(day.date);
            if (sectionDate.toDateString() === today.toDateString()) {
                $section.addClass('expanded');
            } else {
                $section.addClass('collapsed');
            }

            // Add event listener to toggle section visibility
            $h2.on('click', function() {
                $section.toggleClass('expanded collapsed');
            });

            // Set background image for sections containing Osaka
            if (containsOsaka) {
                $h2.css('background-image', "url('./images/osaka-image.jpg')");
            }
        });

    }).fail(function(error) {
        console.error('Error loading schedule:', error);
    });
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

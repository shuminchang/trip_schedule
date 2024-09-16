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
            let containsOkayama = false;

            day.events.forEach(function(event) {
                const $li = $('<li>');
                const $details = $('<details>');
                if (event.important) {
                    $details.addClass('important');
                }
                const $summary = $('<summary>').html(`${getEventIcon(event.description)} ${event.time ? `${event.time}: ` : ''}${event.description}`);
                $details.append($summary);

                if (event.description.includes('岡山')) {
                    containsOkayama = true;
                }

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

            if (containsOkayama) {
                $h2.css('background-image', "url('./images/okayama-image.jpg')");
            }
        });

    }).fail(function(error) {
        console.error('Error loading schedule:', error);
    });
});

$(document).ready(function() {
    const checklistItems = [
        {
            category: '證件',
            icon: 'fas fa-passport',
            items: ['護照', '入境(線上)', '登機證']
        },
        {
            category: '票券',
            icon: 'fas fa-bus',
            items: ['HARUKA機場快線', '關西廣島周遊券', 'ICOCA大阪交通卡', '渡輪票、時間']
        },
        {
            category: '行李',
            icon: 'fas fa-suitcase',
            items: ['衣物', '盥洗用具', '睡眠用具', '個人藥品', '雨具', '充電器', '行動電源']
        },
        {
            category: '其他',
            icon: 'fas fa-wifi',
            items: ['遠傳漫遊', '日幣', '信用卡', '家裡鑰匙']
        }
    ];

    const generateSafeId = (text) => {
        return text.split('').map(char => char.charCodeAt(0).toString(36)).join('');
    };

    const $checklist = $('#checklist ul');

    checklistItems.forEach((category) => {
        const $li = $('<li>');
        const $details = $('<details>');
        const $summary = $('<summary>').html(`<i class="${category.icon}"></i> ${category.category}`);
        $details.append($summary);

        category.items.forEach((item) => {
            const safeId = generateSafeId(item);
            const $div = $('<div>');
            const $checkbox = $('<input type="checkbox">').attr('id', safeId);
            const $label = $('<label>').attr('for', $checkbox.attr('id')).text(item);
            $div.append($checkbox).append($label);
            $details.append($div);
        });

        $li.append($details);
        $checklist.append($li);
    });

    // Optional: Add the strikethrough effect dynamically
    $('#checklist input[type="checkbox"]').on('change', function() {
        $(this).next('label').css('text-decoration', $(this).is(':checked') ? 'line-through' : 'none');
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

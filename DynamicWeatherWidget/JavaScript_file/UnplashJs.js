$(document).ready(function() {
    // OpenWeatherMap API key
    const weatherAPIKey = 'aa37f491ecd2e0e72063ec4eddaeaaf6';

    // Weather card template
    const weatherCardTemplate = $('#weatherCardTemplate').html();

    // Unsplash API access key
    const unsplashAccessKey = 'L8rnJgIcj7DKxzBg0Rn2nSh-ThvhQQ2Dlw8dGKw8_-w';

    // Unsplash image card template
    const unsplashImageCardTemplate = $('#unsplashImageCardTemplate').html();

    // Default category (space)
    const defaultCategory = 'space';

    // Function to fetch and display weather information
    function displayWeather(city) {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherAPIKey}`;

        $.ajax({
            url: weatherUrl,
            method: 'GET',
            success: function(data) {
                console.log('Weather API Response:', data);

                const temperature = Math.round(data.main.temp); // Round temperature to remove decimal
                const description = data.weather[0].description;
                const humidity = data.main.humidity;
                const windSpeed = data.wind.speed;
                const iconCode = data.weather[0].icon; // Get weather icon code

                // Calculate local time based on city's longitude
                const timezoneOffset = data.timezone / 3600; // Convert timezone from seconds to hours
                const date = new Date();
                date.setHours(date.getUTCHours() + timezoneOffset);
                let hours = date.getHours();
                let minutes = date.getMinutes();
                let meridian = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12;
                minutes = minutes < 10 ? '0' + minutes : minutes;
                const formattedDateTime = `${hours}:${minutes}${meridian}`;

                // Update the weather card content
                const weatherCard = $(weatherCardTemplate); // Create jQuery object from template
                weatherCard.find('.temperature').text(`${temperature}°C`);
                weatherCard.find('.mb-1').eq(0).text(`${description}`);
                weatherCard.find('.mb-1').eq(1).text(`Humidity: ${humidity}%`);
                weatherCard.find('.mb-1').eq(2).text(`Wind: ${windSpeed} m/s`);
                weatherCard.find('.mb-1').eq(3).text(`Local Time: ${formattedDateTime}`);
                weatherCard.find('img').attr('src', `http://openweathermap.org/img/w/${iconCode}.png`);

                $('#weatherPanel').html(weatherCard);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching weather data:', error);
                $('#weatherPanel').html('<p>Please enter the city name</p>');
            }
        });
    }

    // Function to update current date and time in 12-hour format (am/pm)
    function updateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.toLocaleString('en-US', { month: 'long' });
        const day = now.getDate().toString().padStart(2, '0');
        let hours = now.getHours();
        let period = 'AM';

        if (hours >= 12) {
            period = 'PM';
        }

        if (hours === 0) {
            hours = 12;
        } else if (hours > 12) {
            hours -= 12;
        }

        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const formattedDateTime = `${year}, ${month} ${day}, ${hours}:${minutes}:${seconds} ${period}`;
        $('#currentTime').text(formattedDateTime);
    }

    // Function to fetch and display image based on category
    function displayImage(category) {
        function fetchAndDisplay(apiUrl) {
            $.ajax({
                url: apiUrl,
                method: 'GET',
                success: function(data) {
                    console.log('Unsplash API Response:', data);

                    if (data.urls && data.urls.regular) {
                        const imageUrl = data.urls.regular;

                        // Create Unsplash image card
                        const unsplashImageCard = $(unsplashImageCardTemplate);
                        unsplashImageCard.find('.card-img-top').attr('src', imageUrl);
                        unsplashImageCard.find('.card-title').text(data.alt_description || 'Unsplash Image');

                        // Replace old Unsplash image card with new one
                        $('#unsplashPanel #unsplashImages').empty().append(unsplashImageCard);
                    } else {
                        console.error('Error: Image URL not found in API response');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error fetching image:', error);
                }
            });
        }

        // Check if the category is the default category
        if (category === defaultCategory) {
            // If it's the default category, just refresh the default image
            fetchAndDisplay(`https://api.unsplash.com/photos/random?query=${defaultCategory}&orientation=landscape&client_id=${unsplashAccessKey}`);
        } else {
            // If it's not the default category, fetch and display images from the selected category
            fetchAndDisplay(`https://api.unsplash.com/photos/random?query=${category}&orientation=landscape&client_id=${unsplashAccessKey}`);
        }
    }

    // Timer to refresh Unsplash image every 20 seconds for the selected category
    setInterval(function() {
        const category = $('#categoryDropdown').val();
        displayImage(category);
    }, 20000);

    // Timer to fetch and update weather information itself every 1 minute
    setInterval(function() {
        const city = $('#cityInput').val();
        displayWeather(city);
    }, 60000);



    // Initial time update
    updateTime();

    // Timer to update time every second
    setInterval(updateTime, 1000);

     // fetch weather information within sec
     setInterval(function() {
        const city = $('#cityInput').val();
        displayWeather(city);
    }, 1000);

    // Event listener for category dropdown change
    $('#categoryDropdown').on('change', function() {
        const selectedCategory = $(this).val();
        displayImage(selectedCategory);
    });

    // Display default image and weather on page load
    displayImage(defaultCategory);
    displayWeather('Sarnia');
});

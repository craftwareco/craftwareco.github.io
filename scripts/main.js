(function (window, document) {
    const menuToggle = document.querySelector('#menu-toggle'),
        menuContainer = document.querySelector('.top-menu'),
        menuItems = menuContainer.querySelectorAll('.menu-item > a'),
        pageContainer = document.querySelector('#page-container'),
        contactFormFields = document.querySelector('#contact-form').querySelectorAll('input, textarea');
        // animation related stuff
        FPS = 60,
        easing = function (t) {
            return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
        }

    // The scroll animation function
    function animateScrollTo(position, duration) {
        const current = window.scrollY,
            delta = position - window.scrollY,
            step = delta / FPS,
            interval = duration / FPS;

        let counter = 0,
            timer = null,
            progress = 0;
        
        if (delta === 0)
            return;
        
        // Every frame of the animation
        function loop() {
            clearTimeout(timer);

            if (counter > FPS)
                return;

            counter++;            

            window.scrollTo(0, current + (progress * easing(progress / Math.abs(delta))));

            timer = setTimeout(loop, interval);

            progress += step;
        }

        loop();
    }

    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();

        const isOpen = menuContainer.classList.contains('open');

        if (isOpen) {
            menuContainer.classList.remove('open');
        } else {
            menuContainer.classList.add('open');
        }
    });

    menuContainer.addEventListener('click', function () {
        this.classList.remove('open');
    });

    menuItems.forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            const target = e.srcElement.href.split('#')[1],
                top = document.querySelector(`#${target}`).offsetTop;
            
            animateScrollTo(top, 800);
        });
    });

    contactFormFields.forEach(function (item) {
        item.addEventListener('input', function () {
            item.parentNode.querySelector('.validation-error').style.visibility = 'hidden';
        });
    });

    window.addEventListener('scroll', function () {
        // Debounce / async it
        requestAnimationFrame(function () {
            if (window.scrollY > 40)
                pageContainer.classList.add('fixed-header');
            else
                pageContainer.classList.remove('fixed-header');
        });
    }, true);

    document.querySelector('#contact-form').addEventListener('submit', function (e) {
        e.preventDefault();

        if (!Array.from(contactFormFields).every(f => f.value.trim().length)) {
            contactFormFields.forEach(function (item) {
                if (item.value)
                    return;

                item.parentNode.querySelector('.validation-error').style.visibility = 'visible';
            })
        }

        const formData = Array.from(contactFormFields).map(f => f.value.trim());

        fetch(this.action,{
            method: 'post',
            data: JSON.stringify(formData)
        });
    }, true);
})(window, document);
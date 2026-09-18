onload = () => {
      const c = setTimeout(() => {
        document.body.classList.remove("not-loaded");
        
        function createShootingStar() {
          const star = document.createElement('div');
          star.className = 'shooting-star';
          star.style.top = Math.random() * 60 + '%';
          star.style.animationDelay = '0s';
          star.style.animationDuration = (Math.random() * 1.5 + 2) + 's';
          
          document.querySelector('.shooting-stars').appendChild(star);
          
          setTimeout(() => {
            star.remove();
          }, 4000);
        }
        
        setInterval(() => {
          if (Math.random() > 0.3) { 
            createShootingStar();
          }
        }, Math.random() * 5000 + 3000);
        clearTimeout(c);
      }, 1000);
    };
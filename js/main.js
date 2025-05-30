document.addEventListener("DOMContentLoaded", function () {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => console.log("[SW registrado]", reg.scope))
        .catch((err) => console.error("[SW error]", err));
    });
  }

  // Inicializar WOW.js
  new WOW().init();

  // Owl Carousel
  const owlCarousel = document.querySelector(".owl-carousel");
  if (owlCarousel) {
    $(owlCarousel).owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      dots: false,
      autoplay: true,
      autoplayHoverPause: true,
      autoplayTimeout: 3000,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 3,
        },
        1000: {
          items: 4,
        },
      },
    });
  }

  // Scroll para fijar el menú
  window.addEventListener("scroll", function () {
    const scroll = window.scrollY;
    const menu = document.querySelector(".menu");
    const logo = document.querySelector(".logo");
    const menuLinks = document.querySelectorAll(".menu a");
    const navCelularLinks = document.querySelectorAll("nav.celular a");

    if (scroll > 100) {
      menu.style.position = "fixed";
      menu.style.width = "100%";
      menu.style.top = "0";
      menu.style.background = "#fff";
      menu.style.boxShadow = "rgba(0, 0, 0, 0.22) 6px 1px 1px";
      menu.style.zIndex = "100";
      logo.style.color = "#000";
      menuLinks.forEach((link) => (link.style.color = "#000"));
      navCelularLinks.forEach((link) => (link.style.color = "#fff"));

      menuLinks.forEach((link) => {
        link.addEventListener("mouseenter", function () {
          link.style.color = "#6171e2e6";
        });
        link.addEventListener("mouseleave", function () {
          link.style.color = "#000";
        });
      });
    } else {
      menu.style.position = "relative";
      menu.style.background = "transparent";
      menu.style.boxShadow = "0 0 0";
      menuLinks.forEach((link) => (link.style.color = "#fff"));
      navCelularLinks.forEach((link) => (link.style.color = "#fff"));
      logo.style.color = "#fff";

      menuLinks.forEach((link) => {
        link.addEventListener("mouseenter", function () {
          link.style.color = "#56b2f9e0";
        });
        link.addEventListener("mouseleave", function () {
          link.style.color = "#fff";
        });
      });
    }
  });

  // Toggle menú para móviles
  const menuIcon = document.querySelector(".menu-icon");
  const celularNav = document.querySelector("header nav.celular");
  if (menuIcon && celularNav) {
    menuIcon.addEventListener("click", function () {
      celularNav.classList.toggle("active");
    });
  }

  // Cerrar menú cuando se hace clic en un enlace
  const menuLinks = document.querySelectorAll(".menu a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (celularNav) celularNav.classList.remove("active");
    });
  });

  // Enviar correo
  const part1 = "STJWRHo1"; // Parte 1 de la clave codificada en Base64
  const part2 = "eVBYOUFv"; // Parte 2 de la clave codificada en Base64
  const part3 = "clNtTkM="; // Parte 3 de la clave codificada en Base64
  const encodedKey = `${part1}${part2}${part3}`; // Reunir las partes

  emailjs.init(atob(encodedKey)); // Inicializar EmailJS con la clave decodificada

  const btn = document.getElementById("enviar_form");
  const formulario = document.getElementById("formulario-contacto");

  if (formulario) {
    formulario.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevenir el envío por defecto

      btn.value = "Enviando...";

      const serviceID = "default_service"; // ID del servicio
      const templateID = "template_gfoncad"; // ID de la plantilla

      // Enviar el formulario usando EmailJS
      emailjs
        .sendForm(serviceID, templateID, this)
        .then(() => {
          btn.value = "Enviar";
          formulario.reset(); // Resetear el formulario
          // Mostrar mensaje de éxito usando SweetAlert2
          Swal.fire({
            title: "¡Correo Enviado!",
            html: "El correo se envió correctamente.<br>Gracias por escribirnos,<br>nos pondremos en contacto a la brevedad.",
            icon: "success",
          });
        })
        .catch((err) => {
          btn.value = "Enviar";
          // Mostrar mensaje de error usando SweetAlert2
          Swal.fire({
            title: "Error",
            text: "Ocurrió un error al enviar el correo: " + err.text,
            icon: "error",
          });
        });
    });
  }
});

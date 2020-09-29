import React from 'react';

export default function Contact() {
  return (
    <>
      <div className='d-flex flex-column justify-content-center align-items-center align-items-sm-start'>
        <div>Sportovní 2719, 276 01 Mělník</div>
        <div>adam.pelc94@gmail.com</div>
      </div>
      <div className='pt-3 pt-sm-0 pl-sm-3 d-flex flex-column justify-content-center'>
        <iframe
          className='border border-footer rounded'
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2546.1710362526087!2d14.488491015955546!3d50.34471520285872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470be75ab07bffdd%3A0x42a7bd95df00c44b!2zU3BvcnRvdm7DrSAyNzE5LCAyNzYgMDEgTcSbbG7DrWs!5e0!3m2!1sen!2scz!4v1595410216085!5m2!1sen!2scz'
          frameBorder='0'
          allowFullScreen=''
          aria-hidden='false'
          tabIndex='0'
          title='Mapa'
        />
      </div>
    </>
  );
}

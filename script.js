'use strict';
const intro = document.getElementById('intro');
const envelopeButton = document.getElementById('envelopeButton');
const heartReveal = document.getElementById('heartReveal');
const introCaption = document.getElementById('introCaption');
const invitation = document.getElementById('invitation');
const skipButton = document.getElementById('skipButton');
const weddingMusic = document.getElementById('weddingMusic');
const musicToggle = document.getElementById('musicToggle');
const musicLabel = musicToggle.querySelector('.music-label');
let musicStarted = false;
function syncMusicToggle(){
  const playing = !weddingMusic.paused;
  musicLabel.textContent = playing ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى';
  musicToggle.setAttribute('aria-label',musicLabel.textContent);
  musicToggle.setAttribute('title',musicLabel.textContent);
  musicToggle.setAttribute('aria-pressed',String(playing));
  musicToggle.querySelector('.music-icon').textContent= playing ? '♫' : '♪';
}
function startWeddingMusic(){
  if(musicStarted)return;
  musicStarted=true;
  musicToggle.hidden=false;
  // Invoked synchronously from the envelope click, to satisfy mobile playback policy.
  const playback=weddingMusic.play();
  if(playback && typeof playback.catch==='function') playback.catch(()=>{syncMusicToggle();});
  syncMusicToggle();
}
musicToggle.addEventListener('click',()=>{
  if(weddingMusic.paused){const playback=weddingMusic.play();if(playback && playback.catch)playback.catch(()=>syncMusicToggle());}
  else weddingMusic.pause();
  syncMusicToggle();
});
weddingMusic.addEventListener('play',syncMusicToggle);
weddingMusic.addEventListener('pause',syncMusicToggle);
let introStarted = false;
let introFinished = false;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function finishIntro(){
  if(introFinished) return;
  introFinished = true;
  invitation.classList.add('active');
  document.body.classList.remove('is-locked');
  intro.classList.add('finished');
  document.querySelector('.hero').classList.add('visible');
  window.setTimeout(()=>{intro.style.display='none';invitation.focus({preventScroll:true});},950);
}
function openEnvelope(){
  if(introStarted) return;
  introStarted = true;
  startWeddingMusic();
  envelopeButton.disabled = true;
  intro.classList.add('opening');
  introCaption.textContent='';
  if(reduceMotion){intro.classList.add('show-heart');window.setTimeout(finishIntro,1200);return;}
  window.setTimeout(()=>{intro.classList.add('show-heart');heartReveal.setAttribute('aria-hidden','false');},1150);
  window.setTimeout(finishIntro,4900);
}
envelopeButton.addEventListener('click',openEnvelope);
skipButton.addEventListener('click',finishIntro);
heartReveal.addEventListener('click',finishIntro);
const sections = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const observer = new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}})},{threshold:.12});
  sections.forEach(s=>observer.observe(s));
}else{sections.forEach(s=>s.classList.add('visible'));}
// 5 December 2026, 7 PM Cairo time (UTC+2 in December).
const weddingDate = new Date('2026-12-05T19:00:00+02:00');
const arabicDigits = (n)=>String(n).padStart(2,'0').replace(/\d/g,x=>'٠١٢٣٤٥٦٧٨٩'[Number(x)]);
const fields = {days:document.getElementById('days'),hours:document.getElementById('hours'),minutes:document.getElementById('minutes'),seconds:document.getElementById('seconds')};
function updateCountdown(){
  const delta=Math.max(0,weddingDate.getTime()-Date.now());
  const d=Math.floor(delta/86400000), h=Math.floor((delta%86400000)/3600000),m=Math.floor((delta%3600000)/60000),s=Math.floor((delta%60000)/1000);
  fields.days.textContent=arabicDigits(d);
  fields.hours.textContent=arabicDigits(h);
  fields.minutes.textContent=arabicDigits(m);
  fields.seconds.textContent=arabicDigits(s);
  if(delta===0){document.getElementById('countdownDone').hidden=false;}
}
updateCountdown();
window.setInterval(updateCountdown,1000);
const calText='حفل زفاف عمر ومي';
const calDetails='دار المراسم لضباط الشرطة بالجزيرة - قاعة اللوتس، الزمالك، القاهرة';
const googleCalendar='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(calText)+'&dates=20261205T170000Z/20261205T210000Z&details='+encodeURIComponent('فرحتنا تكتمل بوجودكم')+'&location='+encodeURIComponent(calDetails);
document.getElementById('calendarLink').href=googleCalendar;

(() => {
  let autoScroll = false;
  let frame;
  let lastTime = 0;
  let position = 0;
  let startTimer;
  let cancelled = false;
  let started = false;

  const speed = 32;

  function stopScroll() {
    cancelled = true;
    autoScroll = false;
    clearTimeout(startTimer);
    cancelAnimationFrame(frame);
  }

  function animateScroll(time) {
    if (!autoScroll) return;

    if (!lastTime) lastTime = time;

    const delta = Math.min(time - lastTime, 50) / 1000;
    lastTime = time;

    position += speed * delta;
    window.scrollTo(0, position);

    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    if (position >= maxScroll - 2) {
      autoScroll = false;
      return;
    }

    frame = requestAnimationFrame(animateScroll);
  }

  function startScroll() {
    if (cancelled) return;

    autoScroll = true;
    position = window.scrollY;
    lastTime = 0;

    frame = requestAnimationFrame(animateScroll);
  }

  const envelope = document.getElementById(
    'envelopeButton'
  );

  if (envelope) {
    envelope.addEventListener('click', () => {
      if (started) return;

      started = true;

      startTimer = setTimeout(() => {
        if (cancelled) return;
        startScroll();
      }, 9000);
    });
  }

  window.addEventListener('touchmove', stopScroll, {
    passive: true
  });

  window.addEventListener('wheel', stopScroll, {
    passive: true
  });

  document.addEventListener('keydown', stopScroll);

})();

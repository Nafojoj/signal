function showPage(id){
  var pages = document.querySelectorAll('.page');
  for(var i=0;i<pages.length;i++){
    pages[i].classList.remove('active');
  }
  var btns = document.querySelectorAll('nav button');
  for(var i=0;i<btns.length;i++){
    btns[i].classList.remove('active');
  }
  document.getElementById('page-'+id).classList.add('active');
  var nb = document.getElementById('nav-'+id);
  if(nb) nb.classList.add('active');
  window.scrollTo( 0,0 );
  if(window.onPageChange) window.onPageChange();
}

function checkEmail(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

document.addEventListener('DOMContentLoaded',function(){
  var form = document.getElementById('brief-form');
  if(!form) return;

  var nm = document.getElementById('f-name');
  var em = document.getElementById('f-email');

  nm.addEventListener('input',function(){
    nm.classList.remove('err');
    document.getElementById('err-name').classList.remove('show');
  });

  em.addEventListener('input',function(){
    em.classList.remove('err');
    document.getElementById('err-email').classList.remove('show');
  });

  form.addEventListener('submit',function(e){
    e.preventDefault();
    var ok = true;

    if(!nm.value.trim()){
      nm.classList.add('err');
      document.getElementById('err-name').classList.add('show');
      ok = false;
    }else{
      nm.classList.remove('err');
      document.getElementById('err-name').classList.remove('show');
    }

    if(!checkEmail(em.value)){
      em.classList.add('err');
      document.getElementById('err-email').classList.add('show');
      ok = false;
    }else{
      em.classList.remove('err');
      document.getElementById('err-email').classList.remove('show');
    }

    if(!ok) return;

    document.getElementById('form-wrap').style.display='none';
    document.getElementById('success-box').classList.add('show');
  });
});





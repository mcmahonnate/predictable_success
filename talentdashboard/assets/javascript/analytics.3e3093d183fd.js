(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-45570095-1', 'talent-dashboard.herokuapp.com');
  if (window.location.host != "localhost:8000" && window.location.host != "0.0.0.0:8000") {
    ga('send', 'pageview');
  } else {
      console.log('not tracked ' + window.location.pathname)
  }

'use strict';

var $pageMap = {},
    $lastPage;

// loading the $page to DOM
function load($page) {
  $(document).find('#container').assign($page);
}

// routes
page.base('/p');  // SPA pages begin with '/p/'

function foo(ctx, $pageGen) {
  var path = ctx.state.path,
      $curPage;
  // sleep last page
  if ($lastPage) {
    if ($lastPage.data('sleep')) {
      $lastPage.data('sleep')();
    }
  }
  // resume cur page
  if ($pageMap[path]) {
    $curPage = $pageMap[path];
    if ($curPage.data('resume')) $curPage.data('resume')();
  // load new page
  } else {
    $curPage = $pageGen();
    $pageMap[path] = $curPage;
  }
  load($curPage);
}

page('/latest', function (ctx) {
  require.async(['pages/latest'], function ($Latest) {
    foo(ctx, $Latest);
  });
});
page('/hot', function (ctx) {
  require.async(['pages/hot'], function ($Hot) {
    foo(ctx, $Hot); 
  });
});
page('/detail/:postId', function (ctx) {
  require.async(['pages/detail'], function ($Detail) {
    foo(ctx, function () {
      var postId = parseInt(ctx.params.postId);
      return $Detail(postId);
    });
  });
});

page('*', '/latest');  // default page

page();  // init

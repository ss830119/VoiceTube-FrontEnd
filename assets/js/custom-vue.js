var vm = new Vue({
  el:"#app",
  data:{
    video:[],
    isfirst:true,
  },

  ready:function(){
    $('.sort-btn').click(function(){
      if($(this).hasClass('active') && !$(this).hasClass('desc'))
      {
        $(this).addClass('desc');
      }
      else
      {
        $('.sort-btn').removeClass('active');
        $('.sort-btn').removeClass('desc');
        $(this).addClass('active');
      }
      vm.LoadData();
    });

    $('.len-btn').click(function(){
      $('.len-btn').removeClass('active');
      $(this).addClass('active');
      vm.LoadData();
    });
  },
  methods:{
    LoadData: function(){
      var response;
      var sortCond =$('.sort-btn.active').data('value');
      var lenCond  =$('.len-btn.active').data('value');
      var isDesc = $('.sort-btn.active').hasClass('desc');
      $.ajax({
        url: 'https://merik.voicetube.com/demo/data',
        type: 'GET', 
        async: false,
        dataType: 'json',
        contentType: 'application/json', 
        success: function(res){
          response = res.data;
          vm.isfirst = false;

        }
      });

      //篩選條件
      switch (lenCond) {
        case 1:
            response = $.grep(response,function(n){return n.duration < 300;});
            break;
        case 2:
            response = $.grep(response,function(n){return 300 <= n.duration && n.duration <= 600 });
            break;
        case 3:
            response = $.grep(response,function(n){return 600 < n.duration});
            break;
      }
      //排序
      switch (sortCond) {
        case 0:
            response = response.sort(function(a,b){return a.publish-b.publish});
            break;
        case 1:
            response = response.sort(function(a,b){return a.views-b.views});
            break;
        case 2:
            response = response.sort(function(a,b){return a.collectCount-b.collectCount});
            break;
      }

      if(isDesc)
        response.reverse();

      vm.video = response;
    }
  },
  filters: {
    TimeFormat: function(value) { 
      d = Number(value);
      var h = Math.floor(d / 3600);
      var m = Math.floor(d % 3600 / 60);
      var s = Math.floor(d % 3600 % 60);

      var hDisplay = h > 0 ? h + ':' :'';
      var mDisplay = m > 0 ? (m < 10 ? '0' : '') + m + ':' :'';
      var sDisplay = s > 0 ? (s < 10 ? '0' : '') + s  :'';

      return hDisplay + mDisplay + sDisplay; 
    },
    DateFormat: function(value) { 
      d = new Date(Number(value)*1000);
      var mm = d.getMonth() + 1; // getMonth() is zero-based
      var dd = d.getDate();

      return [d.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('/');
      
    },
    LanFormat: function(value) { 
      switch (value){
        case 'cht':
          return "中文";
          break;
        case 'ja':
          return "日文";
          break;
        case 'vi':
          return "越南文";
          break;
        case 'en':
          return "英文";
          break;
      }
    },
    LevelFormat: function(value) { 
      switch (value){
        case 1:
          return "初級";
          break;
        case 2:
          return "中級";
          break;
        case 3:
          return "中高級";
          break;
        case 4:
          return "高級";
          break;
      }
    },

      
    },
})

$(document).ready(function(){
  
  vm.LoadData();
  
})



window.eventRegister && window.eventRegister.registerList('afterLogin', {
  fn: function () {
	  const formattedDate = (timestamp) =>{
		   const date = new Date(timestamp);
		   const year = date.getFullYear();  
		   const month = (date.getMonth() + 1).toString().padStart(2, '0');  
		   const day = date.getDate().toString().padStart(2, '0'); 
		   const hour = date.getHours().toString().padStart(2, '0');
		   const minute = date.getMinutes().toString().padStart(2, '0');
		   const second = date.getSeconds().toString().padStart(2, '0');
		   const formattedDate = `${year}-${month}-${day}`;  
		   return formattedDate
		 }
    window.weaJs.callApi({
      url: '/api/popkqcustom/report/getCheck',
      method: 'POST',
      params: {
        resourceId: '1',
        confirmDate: formattedDate(new Date())
      },
    }).then(function (res) {
      if(res.status == '1' && res.isPop != "false" ){
        window.isLogined = true;
        window.kqdata = res
      }
    });
  }
});
window.eventRegister.registerList('afterThemeRender', {
  fn: function () {
    if (window.isLogined) {
      const dialog = document.createElement('div');
      dialog.id = 'afterLogin_dialogId';
      document.body.appendChild(dialog);
      const acParams = {
        domId: 'afterLogin_dialogId',
        id: 'dc0652580c404601af941a7d3812d228',//发布id
        name: 'MyDialog',
        isPage: false,
        noCss: true
      }
      ecodeSDK.render(acParams);
      window.isLogined = false;
    }

  }
});
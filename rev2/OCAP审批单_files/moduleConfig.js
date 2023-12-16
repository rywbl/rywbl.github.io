/*
  每个模块依赖的静态资源文件配置
*/
window.e9ModuleConfig = [
  // 个性化设置
  {
    title: '个性化设置',
    name: 'f_customSetting',
    page: '/spa/customSetting/index.html',
    lib: [
      '/spa/customSetting/index.css?v=1650921283758',
      '/spa/customSetting/index.js?v=1650921283758',
    ]
  },
  // 流程
  {
    title: '流程前台',
    name: 'f_workflow',
    page: '/spa/workflow/static/index.html',
    lib: [
      '/spa/workflow/static/index.css?v=1680572189837',
      '/spa/workflow/static/index.js?v=1680572189837',
    ]
  }, {
    title: '流程后台',
    name: 'b_workflow',
    page: '/spa/workflow/static4engine/engine.html',
    lib: [
      '/spa/workflow/static4engine/engine.css?v=1666940278103',
      '/spa/workflow/static4engine/engine.js?v=1666940278103',
    ]
  }, {
    title: '流程后台表单设计器',
    name: 'b_excelDesign',
    page: '/spa/workflow/excelDesign/engine.html',
    lib: [
      '/spa/workflow/excelDesign/engine.css?v=1650922445877',
      '/spa/workflow/excelDesign/engine.js?v=1650922445877',
    ]
  }, {
    title: '流程公共模块',
    name: 'workfolwPublic',
    page: '/spa/workflow/index_form.jsp',
    lib: [
      '/spa/workflow/static4public/index.js?v=1650921452334',
      '/spa/workflow/static4public/index.css?v=1650921452334',
    ]
  }, {
    title: '流程表单',
    name: 'workfolwForm',
    page: '/spa/workflow/index_form.jsp',
    lib: [
      '/spa/workflow/static4form/index.js?v=1650921477005',
      '/spa/workflow/static4form/index.css?v=1650921477005',
    ]
  },
  // 引擎二开
  {
    title: '引擎二开',
    name: 'b_customizationDev',
    page: '/spa/customizationDev/static4engine/engine.html',
    lib: [
      '/spa/customizationDev/static4engine/engine.js?v=1650921889883',
      '/spa/customizationDev/static4engine/engine.css?v=1650921889883',
    ]
  },
  // 人力
  {
    title: '人力前台',
    name: 'f_hrm',
    page: '/spa/hrm/index_mobx.html',
    lib: [
      '/spa/hrm/static/index.css?v=1701160730888',
      '/spa/hrm/static/index.js?v=1701160730888',
    ]
  }, {
    title: '人力后台',
    name: 'b_hrm',
    page: '/spa/hrm/engine.html',
    lib: [
      '/spa/hrm/static4engine/engine.css?v=1650921782958',
      '/spa/hrm/static4engine/engine.js?v=1650921782958',
    ]
  }, {
    title: '考勤前台',
    name: 'f_attendance',
    page: '/spa/hrm/static4attendance/index.html',
    lib: [
      '/spa/hrm/static4attendance/index.css?v=1650921491160',
      '/spa/hrm/static4attendance/index.js?v=1650921491160',
    ]
  }, {
    title: '考勤后台',
    name: 'b_attendance',
    page: '/spa/hrm/staticAttendance4engine/engine.html',
    lib: [
      '/spa/hrm/staticAttendance4engine/engine.css?v=1698716154155',
      '/spa/hrm/staticAttendance4engine/engine.js?v=1698716154155',
    ]
  }, {
    title: '新个税前台',
    name: 'f_tax',
    page: '/spa/hrm/static4Tax/index.html',
    lib: [
      '/spa/hrm/static4Tax/index.css?v=1650921505369',
      '/spa/hrm/static4Tax/index.js?v=1650921505369',
    ]
  }, {
    title: '新个税后台',
    name: 'b_tax',
    page: '/spa/hrm/staticTax4engine/engine.html',
    lib: [
      '/spa/hrm/staticTax4engine/engine.css?v=1650921789519',
      '/spa/hrm/staticTax4engine/engine.js?v=1650921789519',
    ]
  }, {
    title: '四川航空通讯录',
    name: 'f_addressBook',
    page: '/spa/e9DevModules/hrm/static/index.html',
    lib: [
      '/spa/e9DevModules/hrm/static/index.css?v=1555920453602',
      '/spa/e9DevModules/hrm/static/index.js?v=1555920453602',
    ]
  },
  //会议
  {
    title: '会议前台',
    name: 'f_meeting',
    page: '/spa/meeting/static/index.html',
    lib: [
      '/spa/meeting/static/index.css?v=1655454550368',
      '/spa/meeting/static/index.js?v=1655454550368',
    ]
  }, {
    title: '会议后台',
    name: 'b_meeting',
    page: '/spa/meeting/static4engine/engine.html',
    lib: [
      '/spa/meeting/static4engine/engine.css?v=1650921808955',
      '/spa/meeting/static4engine/engine.js?v=1650921808955',
    ]
  },
  //日程
  {
    title: '日程前台',
    name: 'f_workplan',
    page: '/spa/workplan/static/index.html',
    lib: [
      '/spa/workplan/static/index.css?v=1650921378730',
      '/spa/workplan/static/index.js?v=1650921378730',
    ]
  }, {
    title: '日程后台',
    name: 'b_workplan',
    page: '/spa/workplan/static4engine/engine.html',
    lib: [
      '/spa/workplan/static4engine/engine.css?v=1650922322558',
      '/spa/workplan/static4engine/engine.js?v=1650922322558',
    ]
  },
  //门户
  {
    title: '门户前台',
    name: 'f_portal',
    page: '/spa/portal/static/index.html',
    lib: [
      '/spa/portal/public/index.css?v=1650920435852',
      '/spa/portal/public/index.js?v=1650920435852',
      '/spa/portal/index.css?v=1650920742983',
      '/spa/portal/index.js?v=1650920742983',
    ]
  }, {
    title: '门户后台',
    name: 'b_portal',
    page: '/spa/portal/static4engine/engine.html',
    lib: [
      '/spa/portal/public/index.css?v=1650920435852',
      '/spa/portal/public/index.js?v=1650920435852',
      '/spa/portal/index.css?v=1650920742983',
      '/spa/portal/index.js?v=1650920742983',
      '/spa/portal/static4engine/engine.css?v=1650921630793',
      '/spa/portal/static4engine/engine.js?v=1650921630793',
    ]
  },
  //协作
  {
    title: '协作前台',
    name: 'f_cowork',
    page: '/spa/cowork/static/index.html',
    lib: [
      '/blog/js/weaverImgZoom/weaverImgZoom_wev8.css',
      '/blog/js/weaverImgZoom/weaverImgZoom_wev8.js',
      '/spa/cowork/static/index.css?v=1650921006286',
      '/spa/cowork/static/index.js?v=1650921006286',
    ]
  }, {
    title: '协作后台',
    name: 'b_cowork',
    page: '/spa/cowork/static4engine/engine.html',
    lib: [
      '/spa/cowork/static4engine/engine.css?v=1650921815570',
      '/spa/cowork/static4engine/engine.js?v=1650921815570',
    ],
  },
  //邮件
  {
    title: '邮件前台',
    name: 'f_email',
    page: '/spa/email/static/index.html',
    lib: [
      '/spa/email/static/index.css?v=1650921090792',
      '/spa/email/static/index.js?v=1650921090792',
    ]
  }, {
    title: '邮件后台',
    name: 'b_email',
    page: '/spa/email/static4engine/engine.html',
    lib: [
      '/spa/email/static4engine/engine.css?v=1650921903682',
      '/spa/email/static4engine/engine.js?v=1650921903682',
    ]
  },
  //资产
  {
    title: '资产前台',
    name: 'f_cpt',
    page: '/spa/cpt/index.html',
    lib: [
      '/spa/cpt/static/index.css?v=1650920947420',
      '/spa/cpt/static/index.js?v=1650920947420',
    ]
  }, {
    title: '资产后台',
    name: 'b_cpt',
    page: '/spa/cpt/engine.html',
    lib: [
      '/spa/cpt/static4engine/engine.css?v=1650921679350',
      '/spa/cpt/static4engine/engine.js?v=1650921679350',
    ]
  },
  //项目
  {
    title: '项目前台',
    name: 'f_prj',
    page: '/spa/prj/index.html',
    lib: [
      '/spa/prj/static/index.css?v=1650921270404',
      '/spa/prj/static/index.js?v=1650921270404',
    ]
  }, {
    title: '项目后台',
    name: 'b_prj',
    page: '/spa/prj/engine.html',
    lib: [
      '/spa/prj/static4engine/engine.css?v=1650922153612',
      '/spa/prj/static4engine/engine.js?v=1650922153612',
    ]
  },
  //集成
  {
    title: '集成前台',
    name: 'f_inte',
    page: '/spa/inte/index.html',
    lib: [
      '/spa/inte/static/index.css?v=1650921160352',
      '/spa/inte/static/index.js?v=1650921160352',
    ]
  }, {
    title: '集成后台',
    name: 'b_integration',
    page: '/spa/integration/static4engine/engine.html',
    lib: [
      '/spa/integration/static4engine/engine.css?v=1650921943837',
      '/spa/integration/static4engine/engine.js?v=1650921943837',
    ]
  },
  //ESB
  {
    title: 'ESB中心',
    name: 'b_esb',
    page: '/spa/esb/static4engine/engine.html',
    lib: [
      '/spa/esb/static4engine/engine.css?v=1650921989418',
      '/spa/esb/static4engine/engine.js?v=1650921989418',
    ]
  },
  //建模
  {
    title: '建模前台',
    name: 'f_cube',
    page: '/spa/cube/index.html',
    lib: [
      '/spa/cube/static/index.tsx.css?v=1650932993719',
      '/spa/cube/static/index.tsx.js?v=1650932993719',
      '/formmode/e9resource/css/iconapp.css',
    ]
  }, {
    title: '建模后台',
    name: 'b_cube',
    page: '/spa/cube/engine.html',
    lib: [
      '/spa/cube/static4engine/engine.css?v=1650922233752',
      '/spa/cube/static4engine/engine.js?v=1650922233752',
      '/formmode/e9resource/css/iconapp.css',
    ]
  },
  //知识
  {
    title: '知识前台',
    name: 'f_document',
    page: '/spa/document/static/index.html',
    lib: [
      '/spa/document/static/index.css?v=1650921049723',
      '/spa/document/static/index.js?v=1650921049723',
    ]
  }, {
    title: '知识后台',
    name: 'b_document',
    page: '/spa/document/static4engine/engine.html',
    lib: [
      '/spa/document/static4engine/engine.css?v=1650921712874',
      '/spa/document/static4engine/engine.js?v=1650921712874',
    ]
  }, {
    title: '文档详情页',
    name: 'docDetail',
    page: '/spa/document/index.jsp',
    lib: [
      '/spa/document/static4Detail/index.css?v=1655454563569',
      '/spa/document/static4Detail/index.js?v=1655454563569',
    ]
  },
  //微博
  {
    title: '微博前台',
    name: 'f_blog',
    page: '/spa/blog/static/index.html',
    lib: [
      '/blog/js/weaverImgZoom/weaverImgZoom_wev8.css',
      '/blog/js/weaverImgZoom/weaverImgZoom_wev8.js',
      '/spa/blog/static/index.css?v=1650920992159',
      '/spa/blog/static/index.js?v=1650920992159',
    ]
  }, {
    title: '微博后台',
    name: 'b_blog',
    page: '/spa/blog/static4engine/engine.html',
    lib: [
      '/spa/blog/static4engine/engine.css?v=1650921823654',
      '/spa/blog/static4engine/engine.js?v=1650921823654',
    ]
  },
  //小应用
  {
    title: '小应用前台',
    name: 'f_smallApp',
    page: '/spa/smallApp/static/index.html',
    lib: [
      '/spa/smallApp/static/index.css?v=1650920893167',
      '/spa/smallApp/static/index.js?v=1650920893167',
    ]
  }, {
    title: '小应用后台',
    name: 'b_smallApp',
    page: '/spa/smallApp/static4engine/engine.html',
    lib: [
      '/spa/smallApp/static4engine/engine.css?v=1650921658975',
      '/spa/smallApp/static4engine/engine.js?v=1650921658975',
    ]
  },
  //微搜
  {
    title: '微搜前台',
    name: 'f_esearch',
    page: '/spa/esearch/static/index.html',
    lib: [
      '/spa/esearch/static/index.css?v=1650921387856',
      '/spa/esearch/static/index.js?v=1650921387856',
    ]
  },
  //财务
  {
    title: '财务前台',
    name: 'f_fna',
    page: '/spa/fna/static/index.html',
    lib: [
      '/spa/fna/static/index.css?v=1650921102564',
      '/spa/fna/static/index.js?v=1650921102564',
    ]
  }, {
    title: '财务后台',
    name: 'b_fna',
    page: '/spa/fna/static4engine/engine.html',
    lib: [
      '/spa/fna/static4engine/engine.css?v=1650981471687',
      '/spa/fna/static4engine/engine.js?v=1650981471687',
    ]
  }, {
    title: '财务多维度预算前台',
    name: 'f_fnaMulit',
    page: '/spa/fnaMulDimensions/static/index.html',
    lib: [
      '/spa/fnaMulDimensions/static/index.css?v=1650921115462',
      '/spa/fnaMulDimensions/static/index.js?v=1650921115462',
    ]
  }, {
    title: '财务多维度预算后台',
    name: 'b_fnaMulit',
    page: '/spa/fnaMulDimensions/static4engine/engine.html',
    lib: [
      '/spa/fnaMulDimensions/static4engine/engine.css?v=1650922096299',
      '/spa/fnaMulDimensions/static4engine/engine.js?v=1650922096299',
    ]
  },
  //公文
  {
    title: '公文前台',
    name: 'f_odoc',
    page: '/spa/odoc/static/index.html',
    lib: [
      '/spa/odoc/static/index.css?v=1650921218830',
      '/spa/odoc/static/index.js?v=1650921218830',
    ]
  }, {
    title: '公文后台',
    name: 'b_odoc',
    page: '/spa/odoc/static4engine/engine.html',
    lib: [
      '/spa/odoc/static4engine/engine.css?v=1650922132036',
      '/spa/odoc/static4engine/engine.js?v=1650922132036',
    ]
  },
  //客户
  {
    title: '客户前台',
    page: '/spa/crm/mobx/index.html',
    name: 'f_crm',
    lib: [
      '/spa/crm/static/index.css?v=1650920973706',
      '/spa/crm/static/index.js?v=1650920973706',
    ]
  }, {
    title: '客户后台',
    name: 'b_crm',
    page: '/spa/crm/static4engine/engine.html',
    lib: [
      '/spa/crm/static4engine/engine.css?v=1650921691566',
      '/spa/crm/static4engine/engine.js?v=1650921691566',
    ]
  },
  //客户报表
  {
    title: '客户报表前台',
    name: 'f_crmReport',
    page: '',
    lib: [
      '/spa/crm/static4report/index.css?v=1650921012914',
      '/spa/crm/static4report/index.js?v=1650921012914',
    ]
  },
  //客户门户
  {
    title: '客户门户前台',
    name: 'f_crmPortal',
    page: '',
    lib: [
      '/spa/crmPortal/mobx/index.css?v=1552370451008',
      '/spa/crmPortal/mobx/index.js?v=1552370451008',
    ]
  },
  //执行力
  {
    title: '执行力前台',
    name: 'f_workrelate',
    page: '/spa/workrelate/index_mobx.html',
    lib: [
      '/spa/workrelate/static/index.css?v=1650921326219',
      '/spa/workrelate/static/index.js?v=1650921326219',
    ]
  },{
    title: '执行力后台',
    name: 'b_workrelate',
    page: '/spa/workrelate/static4engine/engine.html',
    lib: [
      '/spa/workrelate/static4engine/engine.css?v=1650922784928',
      '/spa/workrelate/static4engine/engine.js?v=1650922784928',
    ]
  },
  //组织画像
  {
    title: '组织画像前台',
    name: 'f_portrait',
    page: '/spa/portrait/statis/index.html',
    lib: [
      '/spa/portrait/static/index.css?v=1650922890405',
      '/spa/portrait/static/index.js?v=1650922890405',
    ]
  },{
    title: '组织画像后台',
    name: 'b_portrait',
    page: '/spa/portrait/static4engine/engine.html',
    lib: [
      '/spa/portrait/static4engine/engine.css?v=1650922905161',
      '/spa/portrait/static4engine/engine.js?v=1650922905161',
    ]
  },
  //车辆
  {
    title: '车辆前台',
    name: 'f_car',
    page: '/spa/car/index.html',
    lib: [
      '/spa/car/static/index.css?v=1650921338244',
      '/spa/car/static/index.js?v=1650921338244',
    ]
  }, {
    title: '车辆后台',
    name: 'b_car',
    page: '/spa/car/index.html',
    lib: [
      '/spa/car/static/index.css?v=1650921338244',
      '/spa/car/static/index.js?v=1650921338244',
    ]
  },
  //移动引擎
  {
    title: '移动引擎',
    name: 'b_mobilemode',
    page: '',
    lib: [
      '/font/mobilemode/plugin/iconfont.css?v=1548071365860',
      '/spa/mobilemode/static4engine/engine.css?v=1650921852886',
      '/spa/mobilemode/static4engine/engine.js?v=1650921852886',
    ]
  },
  //demo
  {
    title: 'demo',
    name: 'f_demo',
    page: '',
    lib: [
      '/spa/demo/static/index.css?v=1650921019721',
      '/spa/demo/static/index.js?v=1650921019721',
    ]
  },
  //督查督办前台
  {
    title: '督查督办前台',
    name: 'f_govern',
    page: '/spa/govern/statis/index.html',
    lib: [
      '/spa/govern/static/index.css?v=1650921360897',
      '/spa/govern/static/index.js?v=1650921360897',
    ]
  },
  //督查督办后台
  {
    title: '督查督办后台',
    name: 'b_govern',
    page: '/spa/govern/static4engine/engine.html',
    lib: [
      '/spa/govern/static4engine/engine.css?v=1650922311324',
      '/spa/govern/static4engine/engine.js?v=1650922311324',
    ]
  },
  //信息采编前台
  {
    title: '信息采编前台',
    name: 'f_info',
    page: '/spa/info/statis/index.html',
    lib: [
      '/spa/info/static/index.css?v=1650921029414',
      '/spa/info/static/index.js?v=1650921029414',
    ]
  },
  //信息采编后台
  {
    title: '信息采编后台',
    name: 'b_info',
    page: '/spa/info/static4engine/engine.html',
    lib: [
      '/spa/info/static4engine/engine.css?v=1650921883340',
      '/spa/info/static4engine/engine.js?v=1650921883340',
    ]
  },
  //集成中心-SAP集成
  {
    title: 'SAP集成',
    name: 'b_sapIntegration',
    page: '',
    lib: [
      '/spa/sapIntegration/static4engine/engine.css?v=1650922457075',
      '/spa/sapIntegration/static4engine/engine.js?v=1650922457075',
    ]
  },
  //集成中心-SAP集成
  {
    title: 'SAP集成',
    name: 'b_sapIntegrationPublic',
    page: '',
    lib: [
      '/spa/sapIntegration/static4public/index.css?v=1650922466035',
      '/spa/sapIntegration/static4public/index.js?v=1650922466035',
    ]
  }, 
  {
    title: '数据中心前台',
    name: 'edc_app',
    page: '',
    lib: [
      '/spa/edc/static/app/index.css?v=1650922578632',
      '/spa/edc/static/app/index.js?v=1650922578632',
    ]
  }, 
  {
    title: '数据中心前台',
    name: 'edc_app_v2',
    page: '',
    lib: [
      '/spa/edc/static/app_v2/index.css?v=1650922624942',
      '/spa/edc/static/app_v2/index.js?v=1650922624942',
    ]
  },
  {
    title: '数据中心看板',
    name: 'bs_edc_board',
    page: '',
    lib: [
      '/spa/edc/static4engine/board/engine.css?v=1650922686238',
      '/spa/edc/static4engine/board/engine.js?v=1650922686238',
    ]
  }, 
  {
    title: '数据中心看板组件',
    name: 'bs_edc_board4com',
    page: '/spa/edc/static/app/index.html',
    lib: [
      '/spa/edc/static4engine/board4com/index.css?v=1548055744567',
      '/spa/edc/static4engine/board4com/index.js?v=1548055744567',
    ]
  }, {
    title: '数据中心看板组件mobile',
    name: 'bs_edc_board4mobile',
    page: '',
    lib: [
      '/spa/edc/static4engine/board4mobile/index.css?v=1548055744567',
      '/spa/edc/static4engine/board4mobile/index.js?v=1548055744567',
    ]
  }, {
    title: '数据中心后端应用',
    name: 'bs_edc_app',
    page: '',
    lib: [
      '/spa/edc/static4engine/app/engine.css?v=1650922758681',
      '/spa/edc/static4engine/app/engine.js?v=1650922758681',
    ]
  },{
    title: '数据中心后端报表',
    name: 'bs_edc_report',
    page: '',
    lib: [
      '/spa/edc/static4engine/report/engine.css?v=1650922826854',
      '/spa/edc/static4engine/report/engine.js?v=1650922826854',
    ]
  }, {
    title: '系统导入导出',
    name: 'b_systemei',
    page: '/spa/systemExpAndImp/static4engine/engine.html',
    lib: [
      '/spa/systemExpAndImp/static4engine/engine.css?v=1650922914900',
      '/spa/systemExpAndImp/static4engine/engine.js?v=1650922914900',
    ]
  }, {
    title: '文档对比',
    name: 'f_compared',
    page: '/spa/compared/static/index.html',
    lib: [
      '/spa/compared/static/index.css?v=1650921542269',
      '/spa/compared/static/index.js?v=1650921542269',
    ]
  }, {
    title: '文档对比',
    name: 'b_compared',
    page: '/spa/compared/static4engine/engine.html',
    lib: [
      '/spa/compared/static4engine/engine.css?v=1650922955859',
	  '/spa/compared/static4engine/engine.js?v=1650922955859',
    ]
  }, {
    title: '数据安全后端应用',
    name: 'b_dataSecurity',
    page: '/spa/dataSecurity/static4engine/engine.html',
    lib: [
      '/spa/dataSecurity/static4engine/engine.css?v=1650922949357',
      '/spa/dataSecurity/static4engine/engine.js?v=1650922949357',
    ]
  }, {
    title: '财务公用组件',
    name: 'b_fnaComPublic',
    page: '/spa/fnaComPublic/static4engine/engine.html',
    lib: [
      '/spa/fnaComPublic/static4engine/engine.css?v=1650922983034',
	  '/spa/fnaComPublic/static4engine/engine.js?v=1650922983034',
    ]
  }
]
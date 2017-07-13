console.log('Start');

//Model classes
function Ubigeo(cod, name) {
  this.cod = cod;
  this.name = name;
  this.parent = null;
}
Ubigeo.prototype = {
  print: function() {
    console.log('Código: ' + this.cod + ', name: ' + this.name);
    
    var p = this.parent;
    if(p !== null) {
      console.log('Y mi padre es: ' + p.cod + ', ' + p.name);
    }
  },
  setParent: function(ubigeo) {
    this.parent = ubigeo;
  }
};


function Department(id, name) {
  Ubigeo.call(this, id, name);
};
Department.prototype = Object.create(Ubigeo.prototype);
Department.prototype.setParent = function(ubigeo) {
  this.parent = null;
  
  console.error('This method is not available for departments');
};


function Province(id, name) {
  Ubigeo.call(this, id, name);
};
Province.prototype = Object.create(Ubigeo.prototype);


function District(id, name) {
  Ubigeo.call(this, id, name);
};
District.prototype = Object.create(Ubigeo.prototype);





var u = new Ubigeo('02', 'Arequipa');
u.print();

var d = new Department('01', 'Lima');
d.setParent(u);
d.print();

var p = new Province('52', 'Barranca');
p.setParent(d);
p.print();

var di = new District('253', 'La Molina');
di.setParent(p);
di.print();




/*

//Stage contiene los atributos de las etapas, en el prototype define los métodos disponibles
function Stage(id){
  this.id = id;
}
Stage.prototype = {
  setDate: function(dateString) {
    this.date = dateString;
  }
};

function LiveStage(id){
  Stage.call(this, id);
  this.remainingKm = 0;
  this.liveComments = [];
}
LiveStage.prototype = Object.create(Stage.prototype);
LiveStage.prototype.setRemainingKms = function (kms){
  this.remainingKm = kms;
};
LiveStage.prototype.setLiveComments = function (commentsArray){
  this.liveComments = commentsArray;
};

//Generalización de los módulos a desarrollar para el especial
function Module(configFile){
  this.configFile = configFile;
  this.sponsorActive = false;
  this.logoPath = '';
  this.stagesPath = '';
  this.stages = [];
}
Module.prototype = {
  readData: function() {
    console.log('Este método debería ser sobre-escrito por una de sus clases hijas para leer la información que necesita');
  },
  render: function() {
    console.log('Este método debería ser sobre-escrito por una de sus clases hijas para mostrar contenido');
  },
  update: function() {
    this.readData();
  },
  config: function() {
    console.log('Este método debería ser sobre-escrito por una de sus clases hijas para inicializar el módulo');
  }
};


function ModuleHome(configFile) {
  Module.call(this, configFile);

  this.stage = null;
  this.linkToResults = '#';
  this.linkToSpecial = '#';
  this.commentPath = '';
  
  this.config();
}
ModuleHome.prototype = Object.create(Module.prototype);
ModuleHome.prototype.config = function () {
  var thisModule = this;
  
  jsonReader.readJSON(this.configFile, function(data){
    thisModule.linkToResults = data['link-to-results'];
    thisModule.linkToSpecial = data['link-to-special'];
    thisModule.stagesPath = data['stages-path'];
    thisModule.commentPath = data['live-comments-path'];
    thisModule.sponsorActive = data['sponsor-active'];
    thisModule.logoPath = data['logo-path'];
  });
};

*/
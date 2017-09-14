/*
  Example of promises chain..
  The catch at the end will catch both of the promises.
*/
function getRegistrationId(userId){
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      if(Math.random() < 0.5){
        resolve("0000" + userId);
      }else{
        reject(Error(userId));
      }

    }, Math.random() * 2000);
  });
}

function getRegistrationNumber(registrationId){
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve("REG0011--" + registrationId);
    },100);
  });

}

function loadRegistrationInfo(userId){
  getRegistrationId(userId)
  .then(function(registrationId){
    return getRegistrationNumber(registrationId);
  })
  .then(function(registrationNumber){
    console.log("Your registration number is: " + registrationNumber);
  })
  .catch(function(error){
    console.log("catch error");
    console.log(error);
  });
}

for(var i = 1; i<= 10; i++){
  loadRegistrationInfo(i);
}

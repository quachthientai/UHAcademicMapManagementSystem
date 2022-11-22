
const gStorage = window.localStorage
var vUsernameInput = $("#cLoginID")
var vPasswordInput = $("#cLoginPassword")
var vRememberInput = $('#cLoginRemember')

window.onload = () =>{
   if(gStorage["admin"]){
      const userAdmin = JSON.parse(gStorage.getItem("admin"))
      if(userAdmin.remember){
         vUsernameInput.val(userAdmin.username)
         vPasswordInput.val(userAdmin.password) 
         vRememberInput.prop('checked', true)
      }
   }
}


$("#cLoginBtn").click(function(){
  
   if(vUsernameInput.val() === 'admin' && vPasswordInput.val() === 'admin'){
      const vUserObj = {
         username: vUsernameInput.val(),
         password: vPasswordInput.val(),
         remember: vRememberInput.prop('checked'),
      }
      gStorage.setItem('admin', JSON.stringify(vUserObj))
      
      $(".toast-success").toast({delay:5000},{animation:true})
      $(".toast-success").toast("show")
      
      setTimeout(function (){
         window.location.assign('../pages/DashBoard.html')
      },400)

   }else{
      
      $(".toast-error").toast({delay: 5000},{animation:true})
      $(".toast-error").toast("show")
   }
   
})



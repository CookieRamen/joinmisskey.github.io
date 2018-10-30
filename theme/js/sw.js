if(jm_pathToWorker) {
  // twbs/bootstrap build/sw.jsより借用
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(jm_pathToWorker).then(function(registration) {
      console.log('Service Workerの登録: ', registration.scope);
        registration.onupdatefound = function(){
        var installingWorker = registration.installing
        installingWorker.onstatechange = function(){
          switch(installingWorker.state){
            case 'installed':
              if (navigator.serviceWorker.controller) {
                console.log('Service Workerの更新があります…')
                location.reload(true)
              }
              break
            default:
          }
        }
      }
    }).catch(function(err) {
      console.log('Service Worker登録時にエラー発生しました: ', err)
    })
  }
} else if(jm_p7AppNo && p7) {
  p7.init(jm_p7AppNo,{
    mode:"native",
    subscribe:"manual"
  })
  p7.ready().then(() => p7.isSubscribed()).then((isSubscribed) => {
    Array.prototype.forEach.call(
      document.getElementsByClassName('p7-subscribe'),
      function(el){
        if(isSubscribed){
          el.textContent = jm_p7Unsubscribe
          el.addEventListener(
            'click',
            function(){
              p7.unsubscribe()
              .then(() => {
                el.textContent = jm_p7Subscribe
                alert('購読が解除されました。')
                console.log('Push Notification Unsubscribed!')
              })
            }
          )
        } else {
          el.addEventListener(
            'click',
            function(){
              p7.subscribe()
              .then((res) => {
                if(success in res && res.success == 'subscribe'){
                  console.log('Push Notification Subscribed!')
                } else {
                  alert('購読に失敗しました。')
                  console.log('Push Notification Subscribing is Failed')
                }
              })
            }
          )
          el.textContent = jm_p7Unsubscribe
        }
      }
    )
  })
}
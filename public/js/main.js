const updateLikesId = (btn) => {
    const postId = btn.parentNode.querySelector('[name=postId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    fetch('https://nodejs-mongodb-blog.onrender.com/likes/' + postId, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'csrf-token': csrf,
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
            'Access-Control-Allow-Headers': "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-       Method, Access-Control-Request-Headers"
        },
    })
        .then(result => {
            return result.json()
        })
        .then(data => {
            btn.innerHTML = data.postLikesId + ' ' + '&#xf087';
        })
        .catch(err => {
            console.log(err);
        })
}
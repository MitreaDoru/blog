const updateLikesId = (btn) => {
    const postId = btn.parentNode.querySelector('[name=postId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    fetch('http://localhost:3000/likes/' + postId, {
        method: 'GET',
        headers: {
            'csrf-token': csrf,
            "Content-Type": "application/json",
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
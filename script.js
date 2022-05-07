const html = {
    userEvents: ['click', 'touchend'],
    get(element){
        return document.querySelector(element)
    },
    gets(elements){
        return document.querySelectorAll(elements)
    },
    createListener(element, callback){
        this.userEvents.forEach(e => {
            element.addEventListener(e, callback)
        })
    },
    removeLitener(element, callback){
        this.userEvents.forEach(e => {
            element.removeEventListener(e, callback)
        })
    }
}


let counter         = 1
const btnNext       = html.get('.controls__next')
const btnPrev       = html.get('.controls__prev')
const carousel      = html.get('.carousel')
const allImages     = html.gets('.content__img')
const indicatorsDiv = html.get('.indicators')

window.addEventListener('load', () => {
    cloneImage()
    carousel.style.width = `${ html.gets('.carousel__content').length * 100}%`
    carousel.style.transform = `translateX(${ - counter * 100 / html.gets('.carousel__content').length }%)`
    generateIndicators()
    indicatorsDiv.querySelector('span').classList.add('active')
})

html.createListener(btnNext, next)
html.createListener(btnPrev, prev)

function cloneImage(){
    const firstImage = html.gets('.carousel__content')[0]
    const cloneFirstImage = firstImage.cloneNode(true)
    const lastImage = html.gets('.carousel__content')[allImages.length - 1]
    const cloneLastImage = lastImage.cloneNode(true)
    carousel.appendChild( cloneFirstImage )    
    carousel.insertBefore(cloneLastImage, firstImage)
}


function moveCarousel(n){
    carousel.style.transform = `translateX(${ - n * 100 / html.gets('.carousel__content').length }%)`
    carousel.style.transition = 'transform .3s ease-in'   
}

function next(e){
    e.preventDefault()
    moveCarousel( counter += 1 )
    html.removeLitener(this, next)
}

function prev(e){
    e.preventDefault()
    moveCarousel( counter -= 1)
    html.removeLitener(this, prev)

}

carousel.addEventListener('transitionend', () => {
    html.createListener(btnNext, next)
    html.createListener(btnPrev, prev)
    if(counter > allImages.length){
        counter = 1
        carousel.style.transform = `translateX(${ - counter * 100 / html.gets('.carousel__content').length }%)`
        carousel.style.transition = null        
    }
    
    if(counter <= 0){
        counter = allImages.length
        carousel.style.transform = `translateX(${ -  allImages.length * 100 / html.gets('.carousel__content').length }%)`
        carousel.style.transition = null
    }   

    let indicators = html.gets('.indicators span') 
    for(let i = 1; i <= indicators.length; i++){
        indicators[i - 1].classList.remove('active') 
        if(i === counter) indicators[i - 1].classList.add('active') 
    }
  
})


function generateIndicators(){
    allImages.forEach((img, index) => {
        let span = document.createElement('span')
        indicatorsDiv.appendChild( span )
        html.createListener(span, goTo(index))
    })

    function goTo(index){
        return () => {
            counter = index + 1
            moveCarousel(counter)
        }
    }
}




import React from 'react'
import "../GlobalCss/footer.css"

const Footer = () => {
    return (
        <section id='footer'>
            <footer className="footer mt-auto bg-one">
                <div className="position-fixed bottom-0 start-0 end-0 mx-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2>SMS</h2>
                        <div>
                            Developed by <a className="text-decoration-none footer-a" target='_blank' href="https://github.com/Mr-Jeevan/McaSms.git">Mr. Jeevan et al.,<i className="fa-regular fa-heart"></i></a>
                        </div>
                    </div>
                </div>
            </footer>
        </section>
    )
}

export default Footer
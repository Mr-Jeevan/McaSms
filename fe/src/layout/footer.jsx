import React from 'react'
import "../GlobalCss/footer.css"

const Footer = () => {
    return (
        <section className='footer'>
            <footer className="footer mt-auto py-3">
                <div className="position-fixed bottom-0 start-0 end-0 mx-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2>SMS</h2>
                        <p className="text-muted mb-0">Copyright @2025</p>
                        <div>
                            Developed by <a className="text-decoration-none" href="index.html">Mr. Jeevan et al.,<i className="fa-regular fa-heart ms-1"></i></a>
                        </div>
                    </div>
                </div>
            </footer>
        </section>
    )
}

export default Footer
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const getAboutPage = (req, res) => { 
    res.render('About')
}

export const getMe = (req, res) => { 

    res.render('Me', { user: req.user });
}
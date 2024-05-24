import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import CRUDService from '../services/CRUDService';
import diseaseService from '../services/diseaseService';
import modelAIController from '../controllers/modelAIController';
import diseaseController from '../controllers/diseaseController';
// import doctorController from '../controllers/doctorController';
// import patientController from '../controllers/patientController';
const login = require('../controllers/auth/loginManageSystem');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3Client = require('../config/connectS3AWS');
const authMiddleware = require('../middleware/auth');
let router = express.Router();

let initWebRoutes = (app) => {
    // user
    router.post('/test-api', homeController.testAPI);
    router.get('/', authMiddleware.isAuth, login.login);
    // router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.post('/sign-up-a-new-user', homeController.signUpANewUser);
    router.get('/get-crud', authMiddleware.loggedin, homeController.displayGetCRUD);
    router.get('/edit-crud', authMiddleware.loggedin, homeController.getEditCRUD);
    router.post('/put-crud', authMiddleware.loggedin, homeController.putCRUD);
    router.get('/delete-crud', authMiddleware.loggedin, homeController.deleteCRUD);
    // disease
    router.post('/create-disease', diseaseController.createNewDisease);
    router.get('/delete-disease', authMiddleware.loggedin, diseaseController.deleteDisease);
    router.get('/get-update-disease-page', diseaseController.getUpdateDiseasePage);
    router.post('/update-disease', diseaseController.updateDisease);
    // server-side
    router.get('/login', authMiddleware.isAuth, login.login);
    router.post('/login', login.login);
    router.get('/log-out', login.logout);
    router.get('/sign-up', homeController.getSignUp);
    router.get('/recover-password', homeController.getRecoverPassword);

    router.get('/manage-system/*', authMiddleware.loggedin);
    router.get('/manage-system/dashboard', (req, res) => {
        res.render('dashboard.ejs');
    });
    router.get('/manage-system/manage-users', async (req, res) => {
        let listAllUsers = await CRUDService.getAllUser();
        return res.render('users/manage-users.ejs', { message: '', listAllUsers });
    });
    router.get('/manage-system/add-new-user', (req, res) => {
        return res.render('users/add-users.ejs');
    });
    router.get('/manage-system/user-profile', (req, res) => {
        return res.render('users/user-profile.ejs');
    });

    router.get('/manage-system/manage-diseases', async (req, res) => {
        let listAllDiseases = await diseaseService.getAllDiseases();
        // console.log('listAllDiseases ', listAllDiseases);
        return res.render('diseases/manage-diseases.ejs', { message: '', errCode: 0, listAllDiseases });
    });
    router.get('/manage-system/add-diseases', (req, res) => {
        return res.render('diseases/add-diseases.ejs', {
            message: '',
            errCode: 0,
        });
    });

    // api
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/allcode', userController.GetAllCode);
    router.post('/api/predict-from-android', modelAIController.getPredictDisease);

    // aws
    router.get('/generate-presigned-url', async (req, res) => {
        console.log('req.query = ', req.query);
        const params = {
            Bucket: 'plantix-image-pool',
            Key: req.query.fileName,
            ContentType: req.query.fileType,
        };

        try {
            const command = new PutObjectCommand(params);
            const url = await getSignedUrl(s3Client, command, { expiresIn: 60 }); // URL hết hạn sau 60 giây
            res.send({ url });
        } catch (err) {
            res.status(500).send(err);
        }
    });

    return app.use('/', router);
};

module.exports = initWebRoutes;

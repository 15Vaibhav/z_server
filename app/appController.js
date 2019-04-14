/**
 * Created by Dell on 8/8/2017.
 */

var express = require('express');
var appRouter = express.Router();
const SalonController = require('./base/controller/SalonController');
const LoginController = require('./base/controller/LoginController');
const ImageController = require('./base/controller/ImageController');
const CustomerController = require('./base/controller/CustomerController');
const BookingController = require('./base/controller/BookingController');
const ReviewController = require('./base/controller/ReviewController');
const InventoryController = require('./base/controller/InventoryController');
const BlogController = require('./base/controller/blogController.js');
const ArtistController = require('./base/controller/ArtistController');
appRouter.post('/createSalon', SalonController.createSalon);
appRouter.post('/createNewSalon', SalonController.WEB_CREATE_SALON);
appRouter.post('/fetchSalons', SalonController.FETCH_SALON);
appRouter.post('/addOffer',SalonController.addOffers);
appRouter.post('/getOfferProvided',CustomerController.getOffers);
appRouter.post('/getAllOfferProvided',CustomerController.GET_ALL_OFFER)
appRouter.get('/searchSalons/:saloonName/:city', SalonController.SEARCH_SALON);
appRouter.post('/employee/updateSalon', SalonController.EMPLOYEE_UPDATE_SALON);
appRouter.post('/employee/updateSalonById', SalonController.WEB_EMPLOYEE_UPDATE_SALON);//akki_mann
appRouter.post('/setCat',SalonController.Update_CATEGORIES_CHANGE)
appRouter.post('/saloon/updateSalon', SalonController.UPDATE_SALON);
appRouter.get('/saloon/getEarnPoint/:saloonId', SalonController.GET_EARN_POINTS);
appRouter.post('/saloon/updateAdditionalInfo',SalonController.UPDATE_ADDITIONAL_INFO);
appRouter.post('/saloon/updateSaloonTimings',SalonController.Update_Schedule_Timing);
appRouter.post('/saloon/updateOwnerInfo',SalonController.UPDATE_OWNER_INFORMATION);
appRouter.post('/toExcel', SalonController.excel);
// addBranch will be used to add branch of the salon(on the basis parentName) it will update all the salons of the same
//parentName with the same branchId
appRouter.post('/addBranch', SalonController.ADD_BRANCH);
appRouter.get('/fetchServices', SalonController.FETCH_SERVICES);
 appRouter.post('/createArtist',LoginController.ARTIST_SIGNUP);
 appRouter.post('/uploadArtistImages',ImageController.ARTIST_IMAGE);
 appRouter.post('/artistsByName',ArtistController.FIND_ARTIST);
 appRouter.post('/artistById',ArtistController.FIND_ARTIST_BY_ID);
appRouter.get('/getSalonNumbers',SalonController.GET_SALON_NUMBERS);
appRouter.get('/getArtist',ArtistController.GET_ARTIST);

appRouter.get('/fetchPackages', SalonController.WEB_FETCH_PACKAGES);//akki_mann
appRouter.get('/fetchSaloonService/:saloonId', SalonController.FETCH_SALON_SERVICE);
appRouter.get('/fetchSaloonServiceFromservice/:saloonId', SalonController.WEB_FETCH_SALON_SERVICE);//akki_mann
// A request will be raise by salon
appRouter.post('/raiseRequest', SalonController.RAISE_Request);
// Employee can reject raise request of salon
appRouter.get('/rejectRequest', SalonController.RejectRequest);
appRouter.post('/InvoiceReq',BookingController.GET_INVOICE_REQUEST);
appRouter.post('/rodiPdf',SalonController.RODI);


// For adding saloon Payment Details
appRouter.post('/addPaymentDetails', SalonController.SALOON_PAYMENT);
appRouter.post('/postBlogs',BlogController.POST_BLOGS);
appRouter.post('/uploadBlogImage',ImageController.ADD_BLOG_IMAGE);
appRouter.get('/getAllBlogs',BlogController.GET_ALL_BLOGS);

// find saloon on the basis of saloonId
appRouter.get('/findSaloon/:saloonId', SalonController.FIND_SALON);
appRouter.get('/shutDown/:saloonId', SalonController.SHUT_DOWN);

// will be used to edit rate of the services of saloon

appRouter.post('/service', SalonController.service);


appRouter.post('/postmanService',SalonController.POSTMAN_Service);

//appRouter.get('/reviewRating/:saloonId/:rating', SalonController.reviewRating);

appRouter.post('/updateServiceRequest',SalonController.SERVICE_APPROVAL_REQUEST);
appRouter.post('/deleteApprovalRequest',SalonController.DELETE_SERVICE_REQUEST);
appRouter.get('/getPendingRequest',SalonController.GET_PENDING_RAISE_REQUEST);
appRouter.post('/acceptRequest',SalonController.ACCEPT_SERVICE_REQUEST);

//adding Offers
appRouter.post('/addOffers', SalonController.ADD_OFFERS);
appRouter.post('/editOffers', SalonController.EDIT_OFFER);
appRouter.get('/pramotional',BookingController.PRAMOTIONAL_MESSAGES);


appRouter.get('/changePackageIsValid/:packageId/:isValid',SalonController.CHANGE_PACKAGE_VALID);

// For LoginController
appRouter.post('/customerSignUp', LoginController.SIGN_UP);
appRouter.post('/logIn', LoginController.logIn);
appRouter.post('/employeeSignUp', LoginController.Employee_Sign_up);
appRouter.post('/changePassword', LoginController.CHANGE_PASSWORD);
appRouter.post('/forgetPassword', LoginController.FORGET_PASSWORD);
// update password function will be called once OTP has been verify on front end
appRouter.post('/updatePassword', LoginController.UPDATE_PASSWORD);
appRouter.get('/getEmployeeActivity/:employeeId', LoginController.GET_EMPLOYEE_ACTIVITY);
appRouter.post('/sendOTP',LoginController.SEND_OTP);
appRouter.post('/updateCustomerInfo',LoginController.UPDATE_CUSTOMER_INFO);
appRouter.post('/logout',LoginController.LOG_OUT);
appRouter.post('/updateFcmId',LoginController.UPDATE_FCM_ID);
appRouter.get('/isValidReferral/:referralCode',LoginController.IS_VALID_REFERAL);

// For ImageController


// Multiple Image Upload
appRouter.post('/uploadRateCard', ImageController.RATE_CARD_UPLOAD);

appRouter.post('/uploadRateCardChange', ImageController.WEB_RATE_CARD_UPLOAD);//akki_mann

// Multiple Image Upload
appRouter.post('/salonTopPhotosUrl', ImageController.IMAGE_UPLOAD);
appRouter.post('/salonTopPhotosUrlChange', ImageController.WEB_IMAGE_UPLOAD);


// Single Image will come
appRouter.post('/frontImageUrl', ImageController.UPDATE_FRONT_IMAGE_URL);

appRouter.post('/frontImageUrlChange', ImageController.WEB_UPDATE_FRONT_IMAGE_URL);//akki_mann
// Single Image will come
appRouter.post('/logoUrl', ImageController.ADD_LOGO_URL);
appRouter.post('/logoUrlChange', ImageController.WEB_ADD_LOGO_URL);//akki_mann


appRouter.get('/rateCardUrl/:saloonId',ImageController.GET_RATE_CARD_URL);



// ImageDetails
appRouter.post('/imageLike', ImageController.IMAGE_LIKE);
appRouter.post('/imageComment', ImageController.IMAGE_ADD_COMMENT);
appRouter.post('/reviewLike', ReviewController.REVIEW_LIKE);
appRouter.post('/reviewComment', ReviewController.REVIEW_ADD_COMMENT);
appRouter.get('/searchByPostedId/:id', ImageController.SEARCH_BY_POSTED_ID);
appRouter.get('/searchBySaloonId/:saloonId', ImageController.SEARCH_BY_SALOON_ID);
appRouter.post('/addReview', ReviewController.ADD_REVIEW);
appRouter.get('/getLogoUrl/:saloonId', ImageController.GET_LOGO_URL);
appRouter.get('/getFrontPageUrl/:saloonId', ImageController.GET_FRONT_IMAGE_URL);
appRouter.get('/getImageUrl/:saloonId', ImageController.GET_SALOON_IMAGE_URL);
appRouter.post('/deleteImage',ImageController.deleteImages);
appRouter.post('/deleteAndAddImage',ImageController.DELETE_ADD_MULTIPLE_IMAGES);
appRouter.get('/fetchReviews/:saloonId',ReviewController.GET_REVIEW);

appRouter.get('/getTopImages/:saloonId', ImageController.WEB_GET_TOP_IMAGE_URL);//akki_mann
appRouter.post('/editTopImage',ImageController.EDIT_TOP_IMAGE);
appRouter.get('/getLikedImages/:customerId/:saloonId',ImageController.GET_CUST_LIKE_IMAGE);
//For Customer
appRouter.post('/customer/getSaloon', SalonController.GET_SALON);
appRouter.post('/customer/suggestionList', SalonController.SUGGESTION_LIST);
appRouter.post('/customer/getSaloonByName', SalonController.GET_SALOON_BY_NAME);
appRouter.post('/customer/findBySaloonId', SalonController.FIND_BY_SALOON_ID);

// For Employee
appRouter.post('/employee/getSaloon', SalonController.EMPLOYEE_GET_SALOON);
appRouter.post('/employee/getSaloonWithSearch', SalonController.WEB_EMPLOYEE_GET_SALOON);//akki_mann
appRouter.post('/employee/getSaloonById', SalonController.WEB_EMPLOYEE_GET_SALOON_BY_ID);//akki_mann
appRouter.post('/employee/getSaloonCount', SalonController.WEB_EMPLOYEE_GET_SALOON_COUNT);//akki_mann
appRouter.post('/employee/getSaloonWithSearchForServices', SalonController.WEB_EMPLOYEE_GET_SALOON_WITH_SERVICES);//akki_mann

appRouter.post('/employee/getSaloonName', SalonController.WEB_EMPLOYEE_GET_SALOON_NAME);//akki_mann

//for Coupons
appRouter.post('/employee/addCouponChange', SalonController.WEB_EMPLOYEE_ADD_COUPON);
appRouter.post('/employee/addCoupon', SalonController.EMPLOYEE_ADD_COUPON);
appRouter.post('/saloon/addCoupon', SalonController.SALOON_ADD_COUPON);
appRouter.post('/updateCoupon', SalonController.UPDATE_COUPON);
appRouter.post('/addSponsoredSaloon', SalonController.ADD_SPONSORED_SALOON);
appRouter.post('/editAddress',SalonController.EDIT_ADDRESS);
appRouter.get('/editAllAddress',SalonController.EditAllAddress);
//for Customer
appRouter.get('/customer/isOpen/:saloonId/:day',CustomerController.OPEN_NOW);
appRouter.get('/customer/basedOnRating',CustomerController.BASED_ON_RATINGS);
appRouter.get('/customer/gender/:saloonType',CustomerController.BASED_ON_GENDER);
appRouter.get('/customer/gender/:saloonType/:lastId',CustomerController.BASED_ON_GENDER_NEXT);
appRouter.post('/customer/test',CustomerController.test);
appRouter.get('/customer/salonInfo/:saloonId',CustomerController.GET_SALOON_INFO);
appRouter.post('/customer/findSaloonServices',CustomerController.FIND_SALON_SERVICES);
appRouter.post('/customer/home/nearBy',CustomerController.NEAR_BY_SALOON);
appRouter.get('/customer/home/deals',CustomerController.DEALS_OFFERS_PACKAGES);
appRouter.post('/customer/home/luxurySaloons',CustomerController.LUXURY_SALOONS);
appRouter.post('/customer/home/allLuxurySaloons',CustomerController.ALL_LUXURY_SALOONS);
appRouter.post('/customer/home/BudgetSaloons',CustomerController.BUDGET_SALOON);
appRouter.post('/customer/home/allBudgetSaloons',CustomerController.ALL_BUDGET_SALOON);
appRouter.post('/customer/home/saloonAtHome',CustomerController.SALOON_AT_HOME);
appRouter.post('/customer/home/getAllBanners', CustomerController.GET_ALL_BANNERS);
appRouter.post('/customer/home/findDeals',CustomerController.FIND_DEALS);
appRouter.post('/customer/home/findScreenBanners',CustomerController.FIND_SCREEN_BANNERS);
appRouter.post('/customer/home/packages',CustomerController.GET_HOME_PAGE_PACKAGE);
appRouter.post('/allPackages',CustomerController.GET_ALL_PACKAGES);
appRouter.post('/allDeals',CustomerController.GET_ALL_DEALS);
appRouter.post('/activeUserCoupon',CustomerController.USER_COUPON_VALID);
appRouter.post('/addUserPackageCouponApplied',CustomerController.INSERT_PACKAGE_COUPON_APPLIED);
appRouter.get('/customer/getMyCash/:userId',CustomerController.GET_MY_CASH);
appRouter.post('/customer/validBookingFeature',CustomerController.VALID_BOOKING_FEATURE);
appRouter.get('/activeCouponsAndDeals/:saloonId',CustomerController.SALOON_ACTIVE_COUPON_DEALS);
appRouter.post('/customer/myFavoriteSaloon',CustomerController.MY_FAVORITE_SALOON);
appRouter.post('/customer/removeFavoriteSaloon',CustomerController.REMOVE_FAVORITE_SALOON);
appRouter.post('/customer/isFavoriteSaloon',CustomerController.IS_FAVOURITE_SALOON);
appRouter.get('/customer/myFavoriteSaloons/:userId',CustomerController.Fetch_All_Favorite_Saloon);
appRouter.post('/viewAllBooking/:customerId',CustomerController.VIEW_ALL_BOOKING_APPOINTMENT);
appRouter.get('/getSaloonPlanList/:saloonId',SalonController.GET_SALOON_PLAN_LIST);

appRouter.post('/getPlatinumSaloonsList',CustomerController.GET_PLATINUM_SALOON);

appRouter.post('/addBanner',SalonController.ADD_BANNER);

appRouter.post('/addBannerChange',SalonController.WEB_ADD_BANNER);//akki_mann

appRouter.get('/getBanner/:bannerId',SalonController.GET_BANNER);
appRouter.get('/getOtpInfo/:loginId/:userType', LoginController.GET_OTP_INFO);
appRouter.post('/verifyOTP',LoginController.VERIFY_OTP);
appRouter.post('/addSaloonService',SalonController.ADD_SALOON_SERVICE);
appRouter.get('/activeCoupon/:saloonId',CustomerController.ACTIVE_COUPON);
appRouter.post('/customer/bookAppointment',BookingController.BOOK_APPOINTMENT);
appRouter.post('/acceptBooking',BookingController.ACCEPT_BOOKING);
appRouter.get('/upcomingBooking/:saloonId', CustomerController.TOTAL_UPCOMING_APPOINTMENT);
appRouter.post('/cancelBooking',BookingController.CANCEL_BOOKING);
appRouter.post('/rejectBooking',BookingController.REJECT_BOOKING);
appRouter.post('/completeBooking', BookingController.COMPLETE_BOOKING);
appRouter.get('/viewAllBookingAppointment/:saloonId',BookingController.VIEW_SALOON_BOOKING);
appRouter.get('/viewCustomerDetails/:customerId/:phoneNumber',BookingController.VIEW_CUSTOMER_DETAILS);
appRouter.get('/getSaloonServiceList/:saloonId', SalonController.GET_SALOON_SERVICE_LIST);
appRouter.post('/getDealByCode',SalonController.GET_DEAL);
appRouter.post('/getCoupon',SalonController.GET_COUPON);
appRouter.post('/getSaloonBookings', BookingController.SHOW_SALOON_BOOKING_LIST);//akki_mann
appRouter.post('/getBookingStatus', BookingController.GET_PARTICULAR_BOOKINGS);//akki_mann
appRouter.post('/addProducts',InventoryController.ADD_PRODUCTS);
appRouter.get('/getAllProducts',InventoryController.GET_ALL_PRODUCTS)
appRouter.post('/uploadProductImages',ImageController.ADD_PRODUCT_IMAGE);
appRouter.post('/updateProduct',InventoryController.UPDATE_PRODUCT);
appRouter.post('/buyProduct',InventoryController.BUY_PRODUCTS);
appRouter.post('/cancelProduct',InventoryController.CANCEL_PRODUCT);
appRouter.get('/getAllOrders/:saloonId',InventoryController.GET_ORDERS);
//>> ankur
appRouter.get('/getCancelledBooking/:saloonId',BookingController.GET_CANCELLED_BOOKINGS);
appRouter.get('/getRejectedBooking/:saloonId',BookingController.GET_REJECTED_BOOKINGS);
appRouter.get('/getCompletedBooking/:saloonId',BookingController.GET_COMPLETED_BOOKINGS);
//<< ankur
//test
appRouter.post('/updateMissedBookings',BookingController.UPDATE_MISSED_BOOKINGS);
appRouter.get('/getPendingAppointments/:saloonId', CustomerController.TOTAL_PENDING_APPOINTMENT);
appRouter.post('/createDeal',SalonController.CREATE_DEAL);
appRouter.post('/findDealsSaloon',SalonController.FIND_SALOON_DEAL);
appRouter.post('/activeDealsCoupons',CustomerController.ACTIVE_COUPON_DEALS);
appRouter.post('/addPackages',SalonController.ADD_PACKAGES);

appRouter.post('/addPackagesChange',SalonController.WEB_ADD_PACKAGES);//akki_mann
appRouter.post('/addSinglePackage',SalonController.WEB_ADD_SINGLE_PACKAGE);//akki_mann
appRouter.post('/addSingleService',SalonController.WEB_ADD_SINGLE_SERVICE);//akki_mann

appRouter.post('/serviceList',SalonController.WEB_SERVICE_LIST);//akki_mann
appRouter.post('/packageList',SalonController.WEB_PACKAGE_LIST);//akki_mann


appRouter.post('/createDealChange',SalonController.WEB_CREATE_DEAL);//akki_mann
appRouter.get('/getCoupons',SalonController.WEB_GET_COUPONS);//akki_mann
appRouter.post('/getCouponWithDetails',SalonController.WEB_GET_COUPON_WITH_DETAILS);//akki_mann
appRouter.post('/getParticularCouponWithDetails',SalonController.WEB_GET_PARTICULAR_COUPON_WITH_DETAILS);//akki_mann
appRouter.post('/updateCouponChange',SalonController.WEB_UPDATE_COUPON);//akki_mann

appRouter.get('/getAllPackages',SalonController.WEB_GET_PACKAGES);//akki_mann
appRouter.post('/getBanner',SalonController.WEB_GET_BANNER);//akki_mann

//appRouter.post('/updatePackage',SalonController.UPDATE_PACKAGE);
appRouter.post('/getPackages',SalonController.GET_PACKAGE);
appRouter.post('/packageExist', SalonController.DOES_PACKAGE_EXIST);

appRouter.post('/returnToken', LoginController.RETURN_TOKEN);

appRouter.post('/getTimeLineImages',ImageController.GET_TIME_LINE);
appRouter.post('/postTimeLineImages',ImageController.POST_TIME_LINE);
appRouter.get('/sendMail/:email/:message/:subject',SalonController.SEND_MAIL);
appRouter.get('/sendMessage/:number',SalonController.SEND_MESSAGE);
appRouter.get('/returnRatingViews/:saloonId',SalonController.RETURN_AVERAGERATE_VIEWS);
appRouter.post('/editName', SalonController.SALON_NAME_CHANGE);
appRouter.get('/clickCall/:mobileNumber/:name', SalonController.CLICK_ON_CALL);//number of salon , name of customer
module.exports = appRouter;

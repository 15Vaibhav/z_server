/**
 * Created by Dell on 8/8/2017.
 */
var constants = {
    REPLY: {
        HASH:"vas_for_mobile_sdk_hash",
        ERROR: "ERROR",
        DATA: "DATA",
        MESSAGE: "MESSAGE",
        TOKEN: "TOKEN",
        RESULT_CODE: "RESULT_CODE",
        COUNT: "COUNT",
        SERVICE_NOT_ADDED: "SERVICE NOT ADDED",
        USER_ID: "user id",
        NoOfImages: "noOfImages",
        NoOfReviews: "noOfReviews",
        reviews: "review",
        Rate:"rate",
        REVIEW_COUNT :"REVIEW_COUNT",
        FAVORITE_COUNT:"FAVORITE_COUNT",
        MY_CASH :"CASH",
        REFER_CODE:"REFER_CODE",
        PDF_URL:"PDF_URL"
    },
    Saloon_Cat:{
       Luxurious:1,
       Pocket_friendly:2
    },
    PRODUCT_CATEGORIES:{
    Clothings:1,
    FACIA_KIT:2
    },
    RESULT_CODE: {
        Success: 0,
        Error: 1,
        WRONG_PASSWORD: 2,
        Blocked:3,
        Check_Msg:4,
        MobileExists:5
    },
    INVENTORY:{
    Booked:0,
    Cancelled:1,
    Delivered:2,
    Not_Allowed:3
    },
    DISTANCE: {
        Limit: 510,
        EARTH_RADIUS: 6371
    },
    NEAR_BUY_LIMIT:{
      Limit:510
    },
    SAC_CODE:{

    },
    TimeLine_Limit:{
           size :5
    },
    PAGE_LIMIT: {
        size: 100
    },
    USER_TYPE: {
        SALON: 1,// It is a salon Owner//   // phone number
        EMPLOYEE: 2,// phone number  //phone number
        CUSTOMER: 3,   //  who will be using the app // Email id
        ARTIST: 4
    },
    Status: {
        PENDING_APPROVAL: 0,
        APPROVED: 1,
        REJECTED: 2
    },
    Zaloonz: {
        Default_Password: "zaloonz",
        Mobile_Number: "9958863008",
        email: "zaloonz.in@gmail.com",
        name: "Sanchi Engineering Pvt. Ltd.",
        ADDRESS_LINE1: "1851/16, Faridabad",
        ADDRESS_LINE2: "121002 haryana"
    },
    TAX: {
        CSGT: 0,
        SGST: 0,
        GSTIN: "06AAFCS1880A2ZO",
        PAN: "AAFCS1880A"
    },
    FILE_PATH: {
        IMAGE_PATH: "..//Images//"
    },
    WORK_TYPE: {
        SALOON_CREATED: "SC",
        PAYMENT_ACCEPTED: "PA"
    },
    homeService:{
        No:1,
        only:2,
        both:3
    },
    HSN_CODE:{
      HSN:996111
    },
    SERVICE:{
        SILVER_PLAN:"SILVER PLAN",
        BASIC_PLAN:"GOLD PLAN",
        SPONSORSHIP:"PLATINUM PLAN"
    },
    MY_CASH: {
        AMOUNT: 50,
        ZER0_BALANCE: 0
    },
    BANNER_TYPE:{
        Salon:1,
        Coupon:2,
        Deal:3,
        Package:4,
        FirstOrderDiscount:5,
        ReferAndEarn:6,
        PricingCategory:7
    },
    OTP_TYPE:{
      SALOON_VERIFICATION:0,
      CUSTOMER_SIGN_UP:1,
      FORGET_PASSWORD:2,
      EMPLOYEE_SIGN_UP:3
    },
    BOOKING_STATUS:{
        Pending:0,//default when a customer do a booking
        Rejected:1,// rejected by saloon
        Cancelled:2,// cancelled by customer
        Approved:3, // when booking is approved or confirmed by saloon
        completed:4,//status will be completed once a customer has taken the service from the saloon
        Missed_Booking:5//missed booking or not attended by customer or saloon
    },
    DealConstant:{
        Code:"DAY"
    },
    PLAN_TYPE:{
        FREE_PLAN:0,
        SILVER:1,
        GOLD:2,
        PLATINUM:3
    },
    services:{
        HAIR_CUT:"HAIR CUT",
        CATEGORY:"HAIR"
    },
    packageValid:{
        Yes: 1,
        No: 0
    },
    requestType:{
        saloonCreation:0,
        serviceApproval:1,
        shutDownSaloon:2
    },
    IMAGE_TYPE:{
      RateCard:1,
      TopImage:2,
      NormalImage:3
    },
	Transaction_Status:{
	  pending:0,
      paid:1	  
	},
	COMMISION:{
		FREE_PLAN:5,
		SILVER:10,
		GOLD:15,
		PLATINUM:20
	},
	Transaction_Type:{
		Monthly_Payment:0,
		Commision_On_booking:1,
		Discount_by_Zaloonz:2,
		sold_On_high_price_by_zaloonz:3
	},
	Earn_Ponits:{
		SILVER:0,
		GOLD:5,
		PLATINUM:8
	},
	Constraints:{
        Booking_Cancelled_Time : 24
    }
};

module.exports = constants;
import { BackendURL, WordPressURL } from "./URL";
import { normalizeSearchTerm } from "./Cal";

export const getAds = async () => {
    var myHeaders = new Headers();

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(BackendURL + 'ads/', requestOptions);
        if (response.status === 200) {
            return await response.json(); // Return the parsed JSON
        } else {
            // console.log(response.status)
            throw new Error('Failed to fetch ads, status code: ' + response.status);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAuctions = async (
    token,
    query,
    cityid,
    categoryid,
    min,
    max,
    live,
    page = 1,
    count = 1
) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const params = new URLSearchParams();


    params.append("page", page)
    params.append("count", count)
    if (query) params.append("filter", query);
    [].concat(cityid || []).filter(Boolean).forEach((id) => params.append("cityIds", id));
    if (categoryid) params.append("categoryId", categoryid);
    if (min !== 10 || max !== 100000 ){
        if (min !== undefined && min !== null) params.append("minC", min);
        if (max !== undefined && max !== null) params.append("maxC", max);
    }
    if (live === true) params.append("live", true);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(
            `${BackendURL}GetAuctions?${params.toString()}`,
            requestOptions
        );

        if (response.ok) {
            return await response.json();
        } else {
            return [];
        }
    } catch (error) {
        console.error(error);
        return [];
    }
};


export const getAutogalleries = async (token) => {
    const myHeaders = new Headers();

    if (token) {
        myHeaders.append("Authorization", `Bearer ${token}`);
    }
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    // https://api.dolox.ir/

    try {
        const response = await fetch(BackendURL + 'GetMyGalleries', requestOptions);
        if (response.status === 200) {
            return await response.json(); // Return the parsed JSON
        } else {
            // console.log(response.status)
            throw new Error('Failed to fetch ads, status code: ' + response.status);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const getBlogs = async (perPage = 4) => {
    try {
        const response = await fetch(
            `${WordPressURL}posts?orderby=date&order=desc&per_page=${perPage}&_embed=1`,
            { method: 'GET', redirect: 'follow' }
        );
        if (response.status !== 200) {
            throw new Error('Failed to fetch blogs, status code: ' + response.status);
        }

        const posts = await response.json();
        return (Array.isArray(posts) ? posts : []).map((post) => {
            const featured =
                post?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                post?.yoast_head_json?.og_image?.[0]?.url ||
                null;

            return {
                id: post.id,
                title: { rendered: post.title?.rendered || '' },
                link: post.link || 'https://blog.dolox.ir',
                date: post.date || null,
                image: featured,
            };
        });
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const createUserReq = async (phonenumber, password, repassword) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
        "phone": phonenumber,
        "password": password,
        "rePassword": repassword        
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(BackendURL + 'Register', requestOptions);

        if (response.status === 200) {
            return response; // Return the parsed JSON for status 200
        } else if (response.status === 400) {
            return { message: 'کابر قبلا ثبت نام کرده' }; // Custom message for status 400
        } else {
            // console.log(response.status);
            throw new Error('Failed with status code: ' + response.status);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const verifyAccount = async (otp) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
   
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(BackendURL + 'ActiveAccount/' + otp, requestOptions);
        return  response
    } catch (error) {
        console.error(error);
        throw error;
    }
};  

export const loginReq = async(phonenumber, password) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "phone": phonenumber,
        "password": password
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch(BackendURL + 'Login', requestOptions)
        .then(async response => {
            // console.log("Status Code:", response.status);

            if (!response.ok) {
                let errorMessage = "خطایی رخ داده است"; // Default error message
                switch (response.status) {
                    case 400:
                        errorMessage = "درخواست اشتباه است. لطفا اطلاعات را بررسی کنید.";
                        break;
                    case 401:
                        errorMessage = "رمز یا شماره تلفن اشتباه است";
                        break;
                    case 403:
                        errorMessage = "دسترسی مجاز نیست. لطفا دوباره تلاش کنید";
                        break;
                    default:
                        errorMessage = "خطای ناشناخته. لطفا دوباره تلاش کنید";
                        break;
                }

                return response.json().then(errorData => {
                    throw new Error(errorData.message || errorMessage);
                });
            }

            // If everything is fine, return the response data
            return response.json();
        })
        .catch(error => {
            // Handle network or other errors
            console.error('Login error:', error);
            throw new Error("رمز یا شماره اشتباه است");
        });
};

export const sendLoginOtp = async (phonenumber) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({ phone: phonenumber }),
        redirect: 'follow'
    };

    try {
        const response = await fetch(BackendURL + 'SendLoginOtp', requestOptions);
        const text = await response.text();

        if (!response.ok) {
            if (response.status === 429) {
                return { error: true, message: "تعداد درخواست زیاد است، کمی بعد دوباره تلاش کنید" };
            }
            return { error: true, message: text || "ارسال کد ناموفق بود" };
        }

        return { error: false };
    } catch (error) {
        console.error('Send otp error:', error);
        return { error: true, message: "ارتباط با سرور برقرار نشد" };
    }
};

export const verifyLoginOtp = async (phonenumber, code) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({ phone: phonenumber, code }),
        redirect: 'follow'
    };

    try {
        const response = await fetch(BackendURL + 'VerifyLoginOtp', requestOptions);
        const text = await response.text();

        if (!response.ok) {
            if (response.status === 400 || response.status === 401) {
                return { error: true, message: "کد وارد شده درست نیست" };
            }
            return { error: true, message: text || "ورود ناموفق بود" };
        }

        let data = null;
        try {
            data = text ? JSON.parse(text) : null;
        } catch {
            data = null;
        }

        const token = typeof data === 'string'
            ? data
            : data?.token ?? data?.Token ?? data?.accessToken ?? data?.access_token ?? (text && !text.startsWith('{') ? text.replace(/"/g, '') : null);

        if (!token) {
            return { error: true, message: "پاسخ سرور نامعتبر بود" };
        }

        return { error: false, token };
    } catch (error) {
        console.error('Verify otp error:', error);
        return { error: true, message: "ارتباط با سرور برقرار نشد" };
    }
};

export const forgetpwReq = async (phonenumber) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
        "phone": phonenumber
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(BackendURL + 'ForgotPassword', requestOptions);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const newpw = async (otp, password) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
        "activeCode":otp,
        "password": password,
        "rePassword": password
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(BackendURL + 'resetpassword', requestOptions);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
    
};  


export const getUser = async (token) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: 'GET', // Changed to GET for fetching user data
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BackendURL}GetMe`, requestOptions);

        // Check if response is ok (status in range 200-299)
        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

// export const getProfile = async (userId, token) => {
//     const myHeaders = new Headers();
//     if (token) {
//         myHeaders.append("Authorization", `Bearer ${token}`);
//     }

//     const requestOptions = {
//         method: 'GET', // Changed to GET for fetching user data
//         headers: myHeaders,
//         redirect: 'follow'
//     };

//     try {
//         const response = await fetch(`${BackendURL}accounts/profile/${userId}/`, requestOptions);

//         // Check if response is ok (status in range 200-299)
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         return await response.json();
//     } catch (error) {
//         console.error('Error fetching user data:', error);
//         throw error;
//     }
// }

export const linkTelegramAccount = async (token) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Length", "0");

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BackendURL}api/telegram/link`, requestOptions);
        const text = await response.text();

        if (!response.ok) {
            console.error('telegram/link failed:', response.status, text);
            return null;
        }

        let payload = text;

        try {
            const parsed = JSON.parse(text);
            payload = typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
        } catch (error) {
            payload = text;
        }

        const match = String(payload).match(/https?:\/\/[^\s"'<>]+/);
        return match ? match[0] : null;
    } catch (error) {
        console.error('Error linking telegram account:', error);
        return null;
    }
}

export const updateUserProfile = async (token,  email, picture, city, first, last, gender ) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`); // Authorization header only

    // Create FormData to handle both text and file data
    const formData = new FormData();

    // Append fields to the form data
    formData.append("FirstName", first);
    formData.append("LastName", last);

    if (email) {
        formData.append("Email", email);
    }
    if (Number(city) > 0) {
        formData.append("CityId", Number(city));
    }
    if (Number(gender) > 0) {
        formData.append("GenderId", Number(gender));
    }
    if (picture) {
        formData.append("Image", picture);
    }

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formData, // Pass the formData object as body
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BackendURL}editUser`, requestOptions);

        // Check if response is ok (status in range 200-299)
        if (!response.ok) {
            const detail = await response.text().catch(() => '');
            console.error('editUser failed:', response.status, detail);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return  response;
    } catch (error) {
        console.error(error);
        // throw error;
    }
};


export const canUserCreateAd = async (token) => { 
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`); // Authorization header only

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BackendURL}ads/check-athorization`, requestOptions);

        // Check if response is ok (status in range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        // throw error;
    }
}
export const getBrands = async (brandId,pagenumber=1) => { 
    var myHeaders = new Headers();
   
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BackendURL}SearchBrand?headBrandId=${brandId}&page=${pagenumber}`, requestOptions);

        // Check if response is ok (status in range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        // throw error;
    }
}

export const getBrandCategory = async () => {
    var myHeaders = new Headers();

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BackendURL}HeadBrands`, requestOptions);

        // Check if response is ok (status in range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        // throw error;
    }
}


export const getBrandsByType = async (type) => {
    var myHeaders = new Headers();

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BackendURL}/ads/brand_type/?type=${type}`, requestOptions);

        // Check if response is ok (status in range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        // throw error;
    }
}

export const getModelsByBrand = async (brand, pagenumber = 1 ) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
     
    };

    try {
        const response = await fetch(`${BackendURL}SearchModel?headBrandId=${brand.BrandId}&page=${pagenumber}`, requestOptions);

        // Check if response is ok (status in range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        // throw error;
    }
}

export const getSalsByModel = async (model) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',

    };

    try {
        const response = await fetch(`${BackendURL}SearchSal?brandId=${model.BrandId}`, requestOptions);
        // Check if response is ok (status in range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        // throw error;
    }
}
let citiesCache = null;

const fetchCityJson = async (path) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const response = await fetch(`${BackendURL}${path}`, {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};

export const getcities = async (model) => {
    if (citiesCache) return citiesCache;

    citiesCache = (async () => {
        try {
            const provinces = await fetchCityJson('GetProvinces');
            const list = Array.isArray(provinces) ? provinces : [];

            const children = await Promise.all(
                list.map((province) => fetchCityJson(`GetCities/${province.CityId}`).catch(() => []))
            );

            return list.map((province, index) => ({
                ...province,
                ParentId: null,
                ChildrenCities: Array.isArray(children[index]) ? children[index] : [],
            }));
        } catch (error) {
            console.error(error);
            citiesCache = null;
            return [];
        }
    })();

    return citiesCache;
}

export const getAuctionCategories = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',

    };

    try {
        const response = await fetch(`${BackendURL}GetCategories`, requestOptions);
        // Check if response is ok (status in range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        // throw error;
    }
}

export const getBodyFeatures = async (model) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',

    };

    try {
        const response = await fetch(`${BackendURL}GetFeatures?brandId=${model.BrandId}`, requestOptions);
        // Check if response is ok (status in range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        // throw error;
    }
}


export const getColors = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
    };
    // console.log( "hello")

    try {
        const response = await fetch(`${BackendURL}ads/colors/`, requestOptions);

        // Check if response is ok (status in range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        // throw error;
    }
}
export const checkAds = async (token) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`); // Authorization header only
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
    };
   
    try {
        const response = await fetch(`${BackendURL}ads/check-athorization`, requestOptions);
        return await response.json();
    } catch (error) {
        console.error(error);
        // throw error;
    }
}

export const getMyads = async (token, pageSize = 200) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`); // Authorization header only
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
    };

    try {
        const response = await fetch(`${BackendURL}GetMyAds?pageNumber=1&pageSize=${pageSize}`, requestOptions);
        const data = await response.json();
        if (Array.isArray(data)) return data;
        return data?.Queryable ?? data?.Items ?? data?.items ?? [];
    } catch (error) {
        console.error(error);
        return [];
    }
}




export const createAdReq = async (
    token,
    brand,
    model,
    year,
    body,
    description,
    kilometer,
    price,
    installments,
    rentorsale,
    city,
    images,
    planid = 1,
    galleryId=-1,
    chatEnabled = true,
    freeZone = false,
    bodyTypeId = null
) => {
    // console.log( token,
    // brand,
    // model,
    // year,
    // body,
    // description,
    // kilometer,
    // price,
    // installments,
    // rentorsale,
    // city,
    // images,
    // planid )
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`); // Authorization header only

    var formdata = new FormData();
    formdata.append("Title", model.Name + " " + year.Year);
    formdata.append("BrandId", model.BrandId);
    formdata.append("YearId", year.YearId);
    body.forEach(feature => formdata.append("SubFeatureId", feature));
    const isAgreement = price == null || price === '' || Number(price) === 0;

    formdata.append("Describe", description || '');
    formdata.append("Worked", Number(kilometer) || 0);
    formdata.append("Price", isAgreement ? 0 : Number(price));
    formdata.append("IsRent", rentorsale);
    formdata.append("IsAgreement", isAgreement);
    formdata.append("CityId", city );
    formdata.append("IsGest", installments);
    const adImages = Array.isArray(images) ? images : [];
    if (adImages.length) {
        formdata.append("CoverImage", adImages[0].file);
        adImages.slice(1).forEach(img => formdata.append("Images", img.file))
    }
    formdata.append("PlanId", planid);
    formdata.append("En_Title", "default");
    formdata.append("ChatEnabled", chatEnabled ? "true" : "false");
    formdata.append("IsFreeZone", freeZone ? "true" : "false");
    if (bodyTypeId) formdata.append("BodyTypeId", bodyTypeId);
    if (galleryId != null && galleryId !== '' && Number(galleryId) > 0) {
        formdata.append("GalleryId", galleryId);
        formdata.append("UseFreeAd", "true");
    }

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    const response = await fetch(BackendURL + "RegisterAd", requestOptions)// You can modify this based on the actual response
    return response
} 

export const AdImages = async (token, adID, images, setLoading) => {
    // Set loading to true before starting the uploads
    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const formData = new FormData();
    images.forEach((image) => {
        formData.append("images", image );
    })

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formData,
            redirect: 'follow'
        };

        try {
            const response = await fetch(`${BackendURL}ads/cars/${adID}/images/`, requestOptions);
           
            return response;
        } catch (error) {
            console.error('Error uploading image:', error);
        }

};

// /auction/?auction_type=&city=page=1
export const getAuctionsByFilter = async (token , auction_type , city ,pagenumber , query) => {
    var myHeaders = new Headers();
    if (token) { 
        myHeaders.append("Authorization", `Bearer ${token}`);
    }
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BackendURL}auction/?auction_type=${auction_type}&city=${city}&page=${pagenumber}`, requestOptions);

        // Check if response is ok (status in range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        // throw error;
    }
}



export const getCities = async (token) => {
    return getcities();
}



export const createAutoGalleryreq = async (
    token,
    name, 
    description,
    address,
    profileimg,
    coverimg,
    details = {}
) => {
  
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`); // Authorization header only

    var formdata = new FormData();
    formdata.append("Name", name);
    formdata.append("Description",description);
    formdata.append("Address", address);
    if (profileimg) {
        formdata.append("Profile", profileimg);
    }
    if (coverimg) {
        formdata.append("Cover", coverimg);
    }
    if (details.type) formdata.append("GalleryType", details.type);
    if (details.manager) formdata.append("ManagerName", details.manager);
    if (details.cityId) formdata.append("CityId", details.cityId);
    if (details.mobile) formdata.append("Mobile", details.mobile);
    if (details.phone) formdata.append("Phone", details.phone);
    if (details.email) formdata.append("Email", details.email);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    const response = await fetch(BackendURL + "RegistGallery", requestOptions)// You can modify this based on the actual response
    return response
} 

export const searchAds = async (
    page ,
    count  ,
    query ,
    barId,
    cityId,
    brandId,
    minYear,
    maxYear,
    minWorked,
    maxWorked,
    minPrice,
    maxPrice,
    headBrandId,
    bodyTypeId,
) => {

    const buildParams = (term) => {
        const params = new URLSearchParams();

        params.append('Page', page);
        params.append('Count', count);

        if (term) params.append('SearchTerm', term);
        const cityIds = Array.isArray(cityId) ? cityId : String(cityId || '').split(',');
        cityIds.filter(Boolean).forEach((id) => params.append('CityIds', id));
        [].concat(brandId || []).filter(Boolean).forEach((id) => params.append('BrandIds', id));
        if (bodyTypeId) params.append('BodyTypeId', bodyTypeId);
        if (minYear) params.append('minYear', minYear);
        if (maxYear) params.append('maxYear', maxYear);
        if (minWorked) params.append('minWorked', minWorked);
        if (maxWorked) params.append('maxWorked', maxWorked);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (barId) params.append('BarId', barId);
        if (headBrandId) params.append('HeadBrandId', headBrandId);

        return params;
    };

    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const request = async (term) => {
        const response = await fetch(`${BackendURL}Search?${buildParams(term).toString()}`, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) return data;

        return data?.Queryable ?? data?.Items ?? data?.items ?? [];
    };

    try {
        const term = normalizeSearchTerm(query);
        const result = await request(term);

        if (Array.isArray(result) && result.length === 0 && term.includes(' ')) {
            return await request(term.replace(/ /g, ''));
        }

        return result;
    } catch (error) {
        console.error('Error fetching ads data:', error);
        throw error;
    }
};




export const deleteAd = async (token , id) => {
    const myHeaders = new Headers();
    if (token) {
        myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const requestOptions = {
        method: 'GET', // Changed to GET for fetching user data
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BackendURL}DeleteAd/${id}`, requestOptions);

        // Check if response is ok (status in range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}


export const getSpecifics = async (token, id) => {
    const myHeaders = new Headers();
    if (token) {
        myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const requestOptions = {
        method: 'GET', // Changed to GET for fetching user data
        headers: myHeaders,
        redirect: 'follow'
    };
    try {
        const response = await fetch(`${BackendURL}GetMySpecificAd?adId=${id}`, requestOptions);
        // console.log("id", response)

        // Check if response is ok (status in range 200-299)
        if (!response.ok) {
            // throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

export const removeImageReq = async (token, id) => {
    const myHeaders = new Headers();
    if (token) {
        myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const requestOptions = {
        method: 'GET', 
        headers: myHeaders,
        redirect: 'follow'
    }

    try {
        const response = await fetch(`${BackendURL}removeAdImage/${id}`, requestOptions);
      
        if (!response.ok) {
          
        }

        return  response
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}


export const EditAdReq = async (token,editData) => {
    // console.log(editData)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    // things that can change
    formdata.append("Describe", editData.description);
    formdata.append("IsRent", editData.rentororsale);
    formdata.append("Worked", editData.kilometer);
    formdata.append("Price", editData.price);
    formdata.append("IsAgreement", editData.price == 0);
    formdata.append("IsGest", editData.installments);
    editData.body.forEach(feature => formdata.append("SubFeatureId", feature));
    // things that don't change
    formdata.append("AdId",editData.ad.AdId);
    formdata.append("CarModelId", editData.ad.BrandId);
    formdata.append("Title", editData.ad.Brand.Name + " " + editData.ad.Year.Sal);
    formdata.append("YearId", editData.ad.YearId);
    formdata.append("CityId", editData.ad.CityId);
    formdata.append("PlanId", editData.ad.PlanId);
    if (editData.bodyType) formdata.append("BodyTypeId", editData.bodyType);
    formdata.append("En_Title", "vechicle");
    // console.log(editData.images)
    formdata.append("CoverImage", editData.images[0]);
    editData.images.shift()
    const newImages = editData.images.filter(item => !editData.ad.AdImages.includes(item));
    // console.log(newImages)
    newImages.forEach(img => formdata.append("Images",img ) )


    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    const response = await fetch(BackendURL + "EditAd", requestOptions)// You can modify this based on the actual response
    return response
} 


// LastAd?Count=3
// home

export const getLastads = async (token, id) => {
    const myHeaders = new Headers();
    if (token) {
        myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }

    try {
        const response = await fetch(`${BackendURL}LastAd?Count=3`, requestOptions);

        if (!response.ok) {

        }

        return response.json()
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

export const getLastGallery = async (token) => {
    const myHeaders = new Headers();
    if (token) {
        myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }

    try {
        const response = await fetch(`${BackendURL}LastGallery?page=1&count=3`, requestOptions);

        if (!response.ok) {

        }

        return response.json()
    } catch (error) {
        console.error('Error fetching gallery data:', error);
        throw error;
    }
}


export const getAdbyId = async (id) => {

    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    }

    try {
        const response = await fetch(`${BackendURL}Ad/${id}`, requestOptions);

        if (!response.ok) {
            return null;
        }

        const text = await response.text();
        if (!text) {
            return null;
        }

        return JSON.parse(text);
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}



export const reportAd = async (token, adid, reportid) => {
    const myHeaders = new Headers();

    if (token) {
        myHeaders.append("Authorization", `Bearer ${token}`);
    }

    var formdata = new FormData();
    formdata.append("Report", reportid);
    formdata.append("En_Title", adid);

    const requestOptions = {
        method: 'POST',
        redirect: 'follow',
        headers: myHeaders,
        body: formdata,
    }

    try {
        const response = await fetch(`${BackendURL}SetReportAd`, requestOptions);

        if (!response.ok) {

        }

        return response
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

// /GetPlans
export const getPlans = async (  id = 0 ) => {
    const myHeaders = new Headers();


    const requestOptions = {
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
    }

    try {
        const response = await fetch(`${BackendURL}GetPlans/${id}`, requestOptions);

        if (!response.ok) {

        }

        return response.json()
    } catch (error) {
        console.error('Error fetching user data:', error);
        return [];
    }
}


// /GetPlans
export const getSubscription = async () => {
    const myHeaders = new Headers();

    const requestOptions = {
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
    }

    try {
        const response = await fetch(`${BackendURL}GetSubscribtion`, requestOptions);

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching user data:', error);
        return [];
    }
}



export const buyPlan = async (token, adId, planId, discountCode = "") => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (token) {
        myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const bodyData = {
        adId,
        planId,
        discountCode,
    };

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(bodyData),
        redirect: "follow",
    };

    try {
        const response = await fetch(`${BackendURL}buyPlan`, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const text = await response.text();
        return text;

    } catch (error) {
        console.error("Error buying plan:", error);
        throw error;
    }
};


// 'https://api.dolox.ir/PrepareSubscribtion/1
export const buySubs = async (token, id, discountCode = "") => {
    const myHeaders = new Headers();

    if (token) {
        myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const params = new URLSearchParams();
    if (discountCode) params.append("discountCode", discountCode);
    const query = params.toString();

    const requestOptions = {
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
    }

    try {
        const response = await fetch(`${BackendURL}PrepareSubscribtion/${id}${query ? `?${query}` : ""}`, requestOptions);
        const text = (await response.text()).trim().replace(/^"|"$/g, "");

        if (!response.ok) {
            console.error('PrepareSubscribtion failed:', response.status, text);
            return "";
        }

        return text;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}
// https://api.dolox.ir/GetAuction/2
// GetPlans
export const getAuctionDetail = async (token , id) => {
    const myHeaders = new Headers();
    if (token) {
        myHeaders.append("Authorization", `Bearer ${token}`);
    }
    const requestOptions = {
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
    }

    try {
        const response = await fetch(`${BackendURL}GetAuction/${id}`, requestOptions);
        const text = await response.text();

        if (!response.ok) {
            console.error('GetAuction failed:', response.status, text);
            return { status: response.status, auction: null };
        }

        return { status: response.status, auction: text ? JSON.parse(text) : null };
    } catch (error) {
        console.error('Error fetching auction:', error);
        return { status: 0, auction: null };
    }
}

export const getAutogalleriesByid = async (id) => {
    const myHeaders = new Headers();

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    // https://api.dolox.ir/

    try {
        const response = await fetch(BackendURL + `GetGallery/${id}`, requestOptions);
        if (response.status === 200) {
            return await response.json(); // Return the parsed JSON
        } else {
            // console.log(response.status)
            throw new Error('Failed to fetch ads, status code: ' + response.status);
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};

// https://api.dolox.ir/GetGalleries?page=1&count=2

export const getAutogalleriesall = async (page = 1, count = 5) => {
    const safePage = Number.parseInt(page, 10) > 0 ? Number.parseInt(page, 10) : 1
    const safeCount = Number.parseInt(count, 10) > 0 ? Number.parseInt(count, 10) : 5

    const requestOptions = {
        method: 'GET',
        headers: new Headers(),
        redirect: 'follow',
    }

    try {
        const response = await fetch(
            `${BackendURL}GetGalleries?page=${safePage}&count=${safeCount}`,
            requestOptions
        )
        if (response.status === 200) {
            return await response.json()
        }
        throw new Error('Failed to fetch galleries, status code: ' + response.status)
    } catch (error) {
        console.error(error)
        throw error
    }
}


export const editGallery = async (token, GalleryId , Describe , Adress , Profile , Cover , GalleryType = null) => {
    
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    // things that can change
    formdata.append("GalleryId", GalleryId);
    formdata.append("Describe", Describe || '');
    formdata.append("Adress", Adress || '');
if(GalleryType != null && GalleryType !== ''){
    formdata.append("GalleryType", GalleryType);
}
if(Profile){
    formdata.append("Profile", Profile);
}
if(Cover){
    formdata.append("Cover", Cover);
}

   
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    const response = await fetch(BackendURL + "EditGallery", requestOptions)
    return response
}

export const getGallerySubscriptionPlans = async () => {
    const requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    try {
        const response = await fetch(
            `${BackendURL}GetGallerySubscriptionPlans`,
            requestOptions
        );
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : data?.value || [];
    } catch (error) {
        console.error("Error fetching gallery subscription plans:", error);
        return [];
    }
};

export const getGalleryQuota = async (token, galleryId) => {
    const myHeaders = new Headers();
    if (token) {
        myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    try {
        const response = await fetch(
            `${BackendURL}GetGalleryQuota?galleryId=${galleryId}`,
            requestOptions
        );
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error fetching gallery quota:", error);
        return null;
    }
};

export const prepareGallerySubscription = async (token, planId, galleryId, discountCode = "") => {
    const myHeaders = new Headers();
    if (token) {
        myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    try {
        const params = new URLSearchParams();
        params.append("planId", planId);
        params.append("galleryId", galleryId);
        if (discountCode) params.append("discountCode", discountCode);

        const response = await fetch(
            `${BackendURL}PrepareGallerySubscription?${params.toString()}`,
            requestOptions
        );
        return await response.text();
    } catch (error) {
        console.error("Error preparing gallery subscription:", error);
        throw error;
    }
};

export const inquireKhalafi = async (nationalCode, mobile, plateNumber) => {
    const params = new URLSearchParams({
        nationalCode: String(nationalCode || ""),
        mobile: String(mobile || ""),
        plateNumber: String(plateNumber || ""),
    });

    const requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    const response = await fetch(
        `${BackendURL}khalafi?${params.toString()}`,
        requestOptions
    );

    const text = await response.text();

    if (!response.ok) {
        throw new Error(text || "خطا در استعلام خلافی");
    }

    return text;
};

export const verifyKhalafi = async (trackId) => {
    const params = new URLSearchParams({
        trackId: String(trackId || ""),
    });

    const requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    const response = await fetch(
        `${BackendURL}VerifyKhalafi?${params.toString()}`,
        requestOptions
    );

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        const message =
            typeof payload === "string"
                ? payload
                : payload?.message || "خطا در دریافت نتیجه خلافی";
        throw new Error(message);
    }

    return payload;
};

export const getChatConversations = async (token) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    try {
        const response = await fetch(`${BackendURL}Chat/conversations`, requestOptions);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("Error fetching chat conversations:", error);
        return [];
    }
};

export const getChatMessages = async (token, conversationId, page = 1, pageSize = 50) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
    });

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    try {
        const response = await fetch(
            `${BackendURL}Chat/conversations/${conversationId}/messages?${params.toString()}`,
            requestOptions,
        );
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("Error fetching chat messages:", error);
        return [];
    }
};

export const getLatestAds = async (count = 8) => {
    const response = await fetch(`${BackendURL}LastAd?Count=${Math.max(count * 3, 24)}`, { method: 'GET', redirect: 'follow' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    const list = Array.isArray(data) ? data : [];
    return [...list]
        .sort((a, b) => (Number(b?.AdId) || 0) - (Number(a?.AdId) || 0))
        .slice(0, count);
};

export const getBodyTypes = async () => {
    const response = await fetch(`${BackendURL}GetSearchBar`, { method: 'GET', redirect: 'follow' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data?.BodyTypes) ? data.BodyTypes : [];
};

export const getCarPrices = async ({ page = 1, pageSize = 20, search = '', brandId, parentBrandId, rootBrandId, hasPrice } = {}) => {
    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
    });
    if (search) params.set('search', search);
    if (brandId != null && brandId !== '') params.set('brandId', String(brandId));
    if (parentBrandId != null && parentBrandId !== '') params.set('parentBrandId', String(parentBrandId));
    if (rootBrandId != null && rootBrandId !== '') params.set('rootBrandId', String(rootBrandId));
    if (hasPrice) params.set('hasPrice', 'true');

    const response = await fetch(`${BackendURL}CarPrices?${params.toString()}`, {
        method: 'GET',
        redirect: 'follow',
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
};

export const getCarPriceDetail = async (brandId) => {
    const response = await fetch(`${BackendURL}CarPrices/${brandId}`, {
        method: 'GET',
        redirect: 'follow',
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
};


export const getWalletBalance = async (token) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BackendURL}Wallet/Balance`, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getWalletSummary = async (token, page = 1, pageSize = 8) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const params = new URLSearchParams();
    params.append("page", page);
    params.append("pageSize", pageSize);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BackendURL}Wallet/Summary?${params.toString()}`, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getWalletTransactions = async (token, page = 1, pageSize = 8, type = '', status = '', fromDate = '', toDate = '') => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const params = new URLSearchParams();
    params.append("page", page);
    params.append("pageSize", pageSize);

    if (type) params.append("type", type);
    if (status) params.append("status", status);
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BackendURL}Wallet/Transactions?${params.toString()}`, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const prepareWalletDeposit = async (token, amount) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const params = new URLSearchParams();
    params.append("amount", amount);
    if (typeof window !== 'undefined') {
        params.append("callbackUrl", `${window.location.origin}/payment/result`);
    } else {
        params.append("callbackUrl", "https://dolox.ir/payment/result");
    }

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BackendURL}Wallet/Deposit?${params.toString()}`, requestOptions);

        if (!response.ok) {
            const detail = await response.text().catch(() => '');
            console.error('Wallet deposit failed:', response.status, detail);
            return "";
        }

        return (await response.text()).trim().replace(/^"|"$/g, "");
    } catch (error) {
        console.error(error);
        return "";
    }
};


export const checkDiscountCode = async (token, code) => {
    const myHeaders = new Headers();

    if (token) {
        myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const params = new URLSearchParams();
    params.append("code", code ?? "");

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BackendURL}DiscountCodeCheck?${params.toString()}`, requestOptions);
        const text = (await response.text()).trim();

        if (!response.ok) {
            let reason = "";
            try {
                reason = JSON.parse(text)?.message || "";
            } catch {
                reason = text;
            }
            return { valid: false, message: reason || "کد تخفیف معتبر نیست" };
        }

        try {
            return { valid: true, ...JSON.parse(text) };
        } catch {
            return { valid: true, message: text };
        }
    } catch (error) {
        console.error(error);
        return { valid: false, message: "بررسی کد تخفیف ناموفق بود" };
    }
};

export const setFavorite = async (token, type, id, favorite) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: favorite ? 'POST' : 'DELETE',
        headers: myHeaders,
        body: JSON.stringify({ type, id }),
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BackendURL}Favorite`, requestOptions);

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            console.error('Favorite sync failed:', response.status, text);
        }

        return response.ok;
    } catch (error) {
        console.error('Failed to update favorite:', error);
        return false;
    }
};

export const getMyFavorites = async (token) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BackendURL}GetMyFavorites`, requestOptions);

        if (!response.ok) {
            return { Galleries: [], Ads: [] };
        }

        const data = await response.json();
        return {
            Galleries: data?.Galleries ?? data?.galleries ?? [],
            Ads: data?.Ads ?? data?.ads ?? [],
            Auctions: data?.Auctions ?? data?.auctions ?? [],
        };
    } catch (error) {
        console.error('Failed to fetch favorites:', error);
        return { Galleries: [], Ads: [] };
    }
};

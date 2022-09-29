export const calTrademarkStatus = (data) => {
    //"Cục cấp giấy đăng kí, đã hoàn thiện nhập quyết định, đăng kí hoàn tất."
    if(data.application.registerNumber && 
        data.application.registerDate)
        return 8;

    //"Cục đã chấp nhận đăng kí, đang đợi khách thanh toán"
    if(data.application.allowanceNumber && 
        data.application.allowanceDate) {
            return 7;
        }

    //"Đã nhận được quyết định từ chối từ cục, trong quá trình phải hồi cục"
    let numberOfHandlingDecision = data.application.decisionRefusals.filter(decision => {
        if(decision.number && decision.date && !decision.responseDate){
            return true
        }
        return false
    }).length

    if(numberOfHandlingDecision === 1) return 6

    //"Đã nhận được thông báo từ chối nội dung từ cục, trong quá trình phản hồi cục"
    let numberOfHandlingRefualAsToSubtance = data.notifyRefusals.filter(noti => {
        if(noti.typeId === 2 && (noti.refusalNumber || noti.notiDate) && !noti.responseDate){
            return true;
        }
        return false
    }).length

    if(numberOfHandlingRefualAsToSubtance >= 1) return 5

    //"Chờ cục chấp nhận đăng kí"
    if(data.application.acceptanceDate && data.application.acceptanceNumber) {
        return 4;
    }


    //"Đã nhận được thông báo từ chối hình thức từ cục, trong quá trình phản hồi cục"
    let numberOfHandlingRefualAsToForm = data.notifyRefusals.filter(noti => {
        if(noti.typeId === 1 && (noti.refusalNumber || noti.notiDate) && !noti.responseDate){
            return true;
        }
        return false
    }).length

    if(numberOfHandlingRefualAsToForm >= 1) return 2


    //"Chờ đồng ý chấp nhận xử lý đơn từ cục"
    if(data.application.fillingDate && data.application.number) {
        return 3;
    }

    //"Khi khách hàng gửi thư lệnh, nhân viên nhập thông tin trên hệ thống"
    return 1;
    
}
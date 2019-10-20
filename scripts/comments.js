function getComment(WQI, params) {
    if (WQI > 90) {
        return `This water body is safe for consumption`;
    }
    if (WQI > 75 && WQI <= 90) {
        return `This water body needs conventional treatments before consumption,
        and its suitable for recreational use`;
    }
    if(WQI > 45 && WQI <= 75) {
        return `This water body can be used but it needs extensive water treatments`;
    }
    if(WQI > 20 && WQI <= 45) {
        return `This water body can be used only for irrigation purposes.
        For renovation purposes, please check sewage pipe system`;
    }
    if(WQI <= 20) {
        return `This water body is very polluted. Do not approach this water body.`;
    }
}
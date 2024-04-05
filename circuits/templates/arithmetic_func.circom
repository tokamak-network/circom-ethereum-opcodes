pragma circom 2.1.6;

function euclidean_div (a, b) {
    var r = a % b;
    var q = a \ b; 
    return [q, r];
}

function _div1 (a, b) {
    // assume b[1] is not zero
    var r[2] = a;
    var q = r[1] \ b[1]; //integer division

    var high_q[2];
    var temp;

    var result;
    var left = 0;
    var right = q;
    var mid;

    while(left <= right){
        if(right == 1){
            mid = right;
        }
        else {
            mid = (left + right) \ 2;
        }
        high_q = mul128(mid, b[0]);
        temp = mid*b[1] + high_q[1];

        if (r[1] > temp || ((r[1] == temp) && (r[0] >= high_q[0]))){
            result = mid;
            left = mid + 1;
        }
        else {
            right = mid - 1;
        }
    }

    high_q = mul128(result, b[0]);
    temp = result*b[1] + high_q[1];

    if(r[1] > temp && r[0] < high_q[0]){
        r[1] = r[1] - 1;
        r[0] = r[0] + 2**128;
    }

    return [
        [result, 0], // quotient
        [r[0] - high_q[0], r[1] - temp] // remainder
    ];
}

function _div2 (a, b) {
    // refer to https://pleiadexdev.notion.site/Division-81a1f13f3b604eba9255008446f77e6d?pvs=4
    var c[5], d[5];
    var temp[2];

    // c0, d0
    temp = euclidean_div(a[0], b[0]);
    c[0] = temp[0];
    d[0] = temp[1];

    // c1, d1
    temp = euclidean_div(a[1], b[0]);
    c[1] = temp[0];
    d[1] = temp[1];

    // c2, d2
    temp = euclidean_div(2**128, b[0]);
    c[2] = temp[0];
    d[2] = temp[1];

    // c3, d3
    temp = euclidean_div(d[1] * d[2] + d[0], b[0]);
    c[3] = temp[0];
    d[3] = temp[1];

    // c4, d4
    temp = euclidean_div(c[0] + d[1] * c[2] + c[3], 2**128);
    c[4] = temp[0];
    d[4] = temp[1];
    
    return [
        [d[4], c[1] + c[4]],    // quotient
        [d[3], 0]               // remainder    
    ];
}

function div (a, b) {
    if(b[0] == 0 && b[1] == 0){
        return [
            [0,0],
            a
        ];
    }
    if (b[1] != 0) {
        return _div1(a, b);
    } else {
        return _div2(a, b);
    }
}

//@Todo
function div512 (a,b) {
    if(b[0] == 0 && b[1] == 0){
        return [
            [0,0,0,0],
            a
        ];
    }
    else{
        return[
           [b[0],b[1],0,0],
           a
        ];
    }
}

function add (a, b) {
    var r = (a[0] + b[0]) % 2**128;
    var carry = (a[0] + b[0]) \ 2**128;
    return [r, (a[1] + b[1] + carry) % 2**128];
}

function mul128 (a, b) {
    var c[2] = euclidean_div(a, 2**64);
    var d[2] = euclidean_div(b, 2**64);

    var carry1 = c[1]*d[1] \ 2**64;
    var remainder1 = c[1]*d[1] % 2**64;
    var carry2 = (c[0]*d[1]+c[1]*d[0] + carry1) \ 2**64;
    var remainder2 = (c[0]*d[1]+c[1]*d[0] + carry1) % 2**64;

    return [remainder2*(2**64) + remainder1, c[0]*d[0] + carry2];
}
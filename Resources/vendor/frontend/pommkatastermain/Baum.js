/*
 * Copyright (c) 2011-2013, Apinauten GmbH
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 *
 *  * Redistributions of source code must retain the above copyright notice, this 
 *    list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice, 
 *    this list of conditions and the following disclaimer in the documentation 
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE 
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * THIS FILE IS GENERATED AUTOMATICALLY. DON'T MODIFY IT.
 */
 
/* define namespace */

if(typeof goog !== 'undefined')
{
    goog.provide('Apiomat.Baum');
    goog.require('Apiomat.AbstractClientDataModel');
}
if(typeof exports === 'undefined')
{
    var Apiomat = Apiomat || {};
}
(function(Apiomat)
{
Apiomat.Baum = function() {
    this.data = new Object();
    /* referenced object methods */
    
    var photo = [];
    
    this.getPhoto = function() 
    {
        return photo;
    };
    
    this.loadPhoto = function(query,callback) 
    {
        var refUrl = this.data.photoHref;
        Apiomat.Datastore.getInstance().loadFromServer(refUrl, {
            onOk : function(obj) {
                photo = obj;
                callback.onOk(obj);
            },
            onError : function(error) {
                callback.onError(error);
            }
        }, undefined, query, Apiomat.Photo);
    };
    
    this.postPhoto = function(_refData, _callback) 
    {
        if(_refData == false || typeof _refData.getHref() === 'undefined') {
            var error = new Apiomat.ApiomatRequestError(Apiomat.Status.SAVE_REFERENECE_BEFORE_REFERENCING);
            if (_callback && _callback.onError) {
                    _callback.onError(error);
            } else if(console && console.log) {
                    console.log("Error occured: " + error);
            }
            return;
        }
        var callback = {
            onOk : function(refHref) {
                if (refHref) {
                                    /* only add reference data if not already in local list */
                    if(photo.filter(function(_elem) {
                        return _elem.getHref() && refHref && _elem.getHref() === refHref;
                    }).length < 1)
                    {
                        photo.push(_refData);
                    } 
                                }
                if (_callback && _callback.onOk) {
                    _callback.onOk(refHref);
                }
            },
            onError : function(error) {
                if (_callback && _callback.onError) {
                    _callback.onError(error);
                }
            }
        };
        if(Apiomat.Datastore.getInstance().shouldSendOffline("POST"))
        {
            Apiomat.Datastore.getInstance( ).sendOffline( "POST", this.getHref(), _refData, "photo", callback );
        }
        else
        {
            Apiomat.Datastore.getInstance().postOnServer(_refData, callback, this.data.photoHref);
        }
    };
    
    this.removePhoto = function(_refData, _callback) 
    {
        var id = _refData.getHref().substring(_refData.getHref().lastIndexOf("/") + 1);
        var deleteHref = this.data.photoHref + "/" + id;
        var callback = {
            onOk : function(obj) {
                            /* Find and remove reference from local list */
                var i = photo.indexOf(_refData);
                if(i != -1) {
                    photo.splice(i, 1);
                }
            ;                 
                if (_callback && _callback.onOk) {
                    _callback.onOk();
                }
            },
            onError : function(error) {
                if (_callback && _callback.onError) {
                    _callback.onError(error);
                }
            }
        };
        Apiomat.Datastore.getInstance().deleteOnServer(deleteHref, callback);
    };    
};
/* static methods */

/**
* Returns a list of objects of this class from server.
*
* If query is given than returend list will be filtered by the given query
*
* @param query (optional) a query filtering the results in SQL style (@see <a href="http://doc.apiomat.com">documentation</a>)
* @param withReferencedHrefs set to true to get also all HREFs of referenced class instances
*/
Apiomat.Baum.getBaums = function(query, callback) {
    Apiomat.Datastore.getInstance().loadListFromServerWithClass(Apiomat.Baum, query, callback);
};

/* inheritance */
Apiomat.Baum.prototype = new Apiomat.AbstractClientDataModel();
Apiomat.Baum.prototype.constructor = Apiomat.Baum;


Apiomat.Baum.prototype.getSimpleName = function() {
    return "Baum";
};

Apiomat.Baum.prototype.getModuleName = function() {
    return "PommkatasterMain";
};

/* easy getter and setter */

   Apiomat.Baum.prototype.getPositionLatitude = function() 
{
    var locArr = this.data.position;
    if(locArr)
    {
        return locArr[0];
    }
};

Apiomat.Baum.prototype.getPositionLongitude = function() 
{
    var locArr = this.data.position;
    if(locArr)
    {
        return locArr[1];
    }
};

Apiomat.Baum.prototype.setPositionLatitude = function(_latitude) 
{
    var locArr = this.data.position;
    if(!locArr)
    {
        locArr = [_latitude, undefined];
    }
    else
    {
        locArr[0] = _latitude;
    }
    this.data.position = locArr;
};

Apiomat.Baum.prototype.setPositionLongitude = function(_longitude) 
{
    var locArr = this.data.position;
    if(!locArr)
    {
        locArr = [0, _longitude];
    }
    else
    {
        locArr[1] = _longitude;
    }
    this.data.position = locArr;
};

        Apiomat.Baum.prototype.getPflegezustand = function() 
{
    return this.data.pflegezustand;
};

Apiomat.Baum.prototype.setPflegezustand = function(_pflegezustand) {
    this.data.pflegezustand = _pflegezustand;
};

        Apiomat.Baum.prototype.getBaumumfang = function() 
{
    return this.data.baumumfang;
};

Apiomat.Baum.prototype.setBaumumfang = function(_baumumfang) {
    this.data.baumumfang = _baumumfang;
};

        Apiomat.Baum.prototype.getPflanzjahr = function() 
{
    return this.data.pflanzjahr;
};

Apiomat.Baum.prototype.setPflanzjahr = function(_pflanzjahr) {
    this.data.pflanzjahr = _pflanzjahr;
};

        Apiomat.Baum.prototype.getPhoto = function() 
{
    return this.data.photo;
};

Apiomat.Baum.prototype.setPhoto = function(_photo) {
    this.data.photo = _photo;
};

        Apiomat.Baum.prototype.getArbeitstitel = function() 
{
    return this.data.arbeitstitel;
};

Apiomat.Baum.prototype.setArbeitstitel = function(_arbeitstitel) {
    this.data.arbeitstitel = _arbeitstitel;
};

        Apiomat.Baum.prototype.getFlurstueck = function() 
{
    return this.data.flurstueck;
};

Apiomat.Baum.prototype.setFlurstueck = function(_flurstueck) {
    this.data.flurstueck = _flurstueck;
};

        Apiomat.Baum.prototype.getBaumplakettennummer = function() 
{
    return this.data.baumplakettennummer;
};

Apiomat.Baum.prototype.setBaumplakettennummer = function(_baumplakettennummer) {
    this.data.baumplakettennummer = _baumplakettennummer;
};

        Apiomat.Baum.prototype.getBaumhoehe = function() 
{
    return this.data.baumhoehe;
};

Apiomat.Baum.prototype.setBaumhoehe = function(_baumhoehe) {
    this.data.baumhoehe = _baumhoehe;
};

        Apiomat.Baum.prototype.getProjektnummer = function() 
{
    return this.data.projektnummer;
};

Apiomat.Baum.prototype.setProjektnummer = function(_projektnummer) {
    this.data.projektnummer = _projektnummer;
};

        Apiomat.Baum.prototype.getSorte = function() 
{
    return this.data.sorte;
};

Apiomat.Baum.prototype.setSorte = function(_sorte) {
    this.data.sorte = _sorte;
};

        Apiomat.Baum.prototype.getBaumalter = function() 
{
    return this.data.baumalter;
};

Apiomat.Baum.prototype.setBaumalter = function(_baumalter) {
    this.data.baumalter = _baumalter;
};


})(typeof exports === 'undefined' ? Apiomat
        : exports);
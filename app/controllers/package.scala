/**
 * Copyright (C) 2015 Kaj Magnus Lindberg
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import com.debiki.core.QuickMessageException
import com.debiki.core.fileExists
import com.debiki.core.Prelude._
import debiki.Globals
import play.api.libs.json.JsValue
import play.api.mvc.Result


package object controllers {

  // Move it to here soon ... No, move it to io.efdi.server.http package?
  def OkSafeJson(json: JsValue, pretty: Boolean = false): Result =
    Utils.OkSafeJson(json, pretty)

  def OkPrettyJson(json: JsValue): Result =
    Utils.OkApiJson(json, pretty = true)

  def OkApiJson(json: JsValue, pretty: Boolean = false): Result =
    Utils.OkApiJson(json, pretty)

  /** Better fail fast with a full page error message, if assets have not yet been
    * bundled by 'gulp build' — instead of returning a html page with links to
    * not-yet-created scripts. The latter would result in a blank page, with
    * "invisible" 404 script-not-found errors in the dev console.
    */
  def dieIfAssetsMissingIfDevTest() {
    if (Globals.isProd) return

    val serverJavascriptPath = "/opt/talkyard/app/assets/server-bundle.js"

    val tips = o"""If you ran 'make up' then this bundle should get
      created automatically, but it might take a minute. You can:""" + i"""
      |  - Wait for a short while, then reload this page, and
      |    run 'make log' to see what's happening.
      |  - Run 'docker-compose ps' and, if the Gulp container isn't running,
      |   'docker-compose restart gulp'.
      """

    def fileName(path: String) = path.takeRightWhile(_ != '/')

    if (!fileExists(serverJavascriptPath))
      throw new QuickMessageException(
        s"Javascript bundle not found: ${fileName(serverJavascriptPath)} [TyE6GKW2]\n\n$tips")
  }

}


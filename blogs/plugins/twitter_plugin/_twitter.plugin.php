<?php
/**
 * This file implements the Twitter plugin.
 *
 * For the most recent and complete Plugin API documentation
 * see {@link Plugin} in ../evocore/_plugin.class.php.
 *
 * This file is part of the b2evolution project - {@link http://b2evolution.net/}
 *
 * @copyright (c)2009 by Francois PLANQUE - {@link http://fplanque.net/}
 * @copyright (c)2007 by Lee Turner - {@link http://leeturner.org/}.
 *
 * @license GNU General Public License 2 (GPL) - http://www.opensource.org/licenses/gpl-license.php
 *
 * @package plugins
 *
 * @author Lee Turner
 * @author fplanque: Francois PLANQUE.
 *
 * @version $Id$
 */
if( !defined('EVO_MAIN_INIT') ) die( 'Please, do not access this page directly.' );


/**
 * Twitter Plugin
 *
 * This plugin will post to your twitter account when you have added a post to your blog.
 *
 * @todo use OAuth -- http://www.jaisenmathai.com/blog/2009/03/31/how-to-quickly-integrate-with-twitters-oauth-api-using-php/
 * @todo Tblue> Do not use cURL, or at least do not depend on it! We could
 *              clone/modify {@link fetch_remote_page()} to be able to do
 *              HTTP POST requests.
 */
class twitter_plugin extends Plugin
{
	/**
	 * Variables below MUST be overriden by plugin implementations,
	 * either in the subclass declaration or in the subclass constructor.
	 */
	var $code = 'evo_twitter';
	var $priority = 50;
	var $version = '0.5';
	var $author = 'Lee Turner';
	var $help_url = 'http://leeturner.org/twitterlution.php';

	/*
	 * These variables MAY be overriden.
	 */
	var $apply_rendering = 'never';
	var $group = 'ping';
	var $number_of_installs = 1;


	/**
	 * Init
	 *
	 * This gets called after a plugin has been registered/instantiated.
	 */
	function PluginInit( & $params )
	{
		$this->name = T_('Twitter plugin');
		$this->short_desc = $this->T_('Post to your Twitter account when you post to your blog');
		$this->long_desc = $this->T_('Posts to your Twitter account to update Twitter with details of your blog post. Remember to set your Twitter account info in your user settings in the admin console.');

		$this->ping_service_name = 'twitter.com';
		$this->ping_service_note = $this->long_desc;
	}


	/**
	 * Event handler: Called before the plugin is going to be installed.
	 *
	 * @todo Tblue> Do not depend on cURL.
	 * 
	 * @return true|string True, if the plugin can be enabled/activated,
	 *                     a string with an error/note otherwise.
	 */
	function BeforeInstall()
	{
		if( ! extension_loaded( 'curl' ) )
		{	// CURL not available :'(
			return T_('The twitter plugin needs the PHP CURL extension to be enabled.');
		}

		// OK:
		return true;
	}


	/**
	 * Check if the plugin can be enabled:
	 *
	 * @return string|NULL
	 */
	function BeforeEnable()
	{

		if( empty($this->code) )
		{
			return T_('The twitter plugin needs a non-empty code.');
		}

		// OK:
		return true;
	}


	/**
	 * Post to Twitter.
	 *
	 * @return boolean Was the ping successful?
	 */
	function ItemSendPing( & $params )
	{
		$username = $this->UserSettings->get( 'twitterlution_username' );
		$password = $this->UserSettings->get( 'twitterlution_password' );
		if( empty($username) || empty($password) )
		{
			$params['xmlrpcresp'] = T_('You must configure a twitter username/password before you can post to twitter.');
			return false;
		}

		//$item_Blog = $params['Item']->get_Blog();
		$title =  $params['Item']->dget('title', 'xml');
		$perm_url = $params['Item']->get_permanent_url();
		$update_text = $this->UserSettings->get( 'twitterlution_update_text' );

		$status = $update_text.' '.$title.' '.$perm_url;	// keep as compact as possible

		$session = curl_init();
		curl_setopt( $session, CURLOPT_URL, 'http://twitter.com/statuses/update.xml' );
		curl_setopt( $session, CURLOPT_POSTFIELDS, 'status='.urlencode($status));
		curl_setopt( $session, CURLOPT_HTTPAUTH, CURLAUTH_BASIC );
		curl_setopt( $session, CURLOPT_HEADER, false );
		curl_setopt( $session, CURLOPT_CONNECTTIMEOUT, 5);
		curl_setopt( $session, CURLOPT_USERPWD, $username.':'.$password );
		curl_setopt( $session, CURLOPT_RETURNTRANSFER, 1 );
		curl_setopt( $session, CURLOPT_POST, 1);
		$result = curl_exec ( $session ); // will be an XML message
		curl_close( $session );

		if( empty($result) )
		{
			return false;
		}
		elseif( preg_match( '�<error>(.*)</error>�', $result, $matches ) )
		{
			$params['xmlrpcresp'] = $matches[1];
			return false;
		}

		return true;
	}

	/**
	 * Allowing the user to specify their twitter account name and password.
	 *
	 * @return array
	 */
	function GetDefaultUserSettings()
	{
		return array(
				'twitterlution_username' => array(
					'label' => T_( 'Your Twitter username' ),
				),
				'twitterlution_password' => array(
					'label' => T_( 'Your Twitter password' ),
					'type' => 'password',
				),
				'twitterlution_update_text' => array(
					'label' => T_( 'Text included in the update' ),
					'defaultvalue' => T_( 'Just posted' ),
				),
			);
	}


}

/*
 * $Log$
 * Revision 1.3  2009/05/26 17:29:46  fplanque
 * A little bit of error management
 * (ps: BeforeEnable unecessary? how so?)
 *
 * Revision 1.2  2009/05/26 17:18:36  tblue246
 * - Twitter plugin:
 * 	- removed unnecessary BeforeEnable() method.
 * 	- Todo: Do not depend on cURL
 * 	- Minor code improvements
 * - fetch_remote_page(): Todo about supporting HTTP POST requests
 *
 * Revision 1.1  2009/05/26 17:00:04  fplanque
 * added twitter plugin + better auto-install code for plugins in general
 *
 * v0.4 - Added the ability to customize the update text.
 * v0.3 - Removed echo of success or failure as this was causing a problem with the latest b2evolution
 * v0.2 - Included source parameter
 * v0.1 - Initial Release
 */
?>
